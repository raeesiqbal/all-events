from rest_framework.permissions import IsAuthenticated
from apps.analytics.models import Chat, Message
from apps.analytics.serializers.create_serializer import (
    AdChatCreateSerializer,
    AdMessageCreateSerializer,
)
from rest_framework.response import Response
from rest_framework import status
from apps.analytics.serializers.get_serializer import (
    ChatListSerializer,
    ChatMessageSerializer,
)
from apps.analytics.serializers.update_serializer import (
    ChatIsArchivedSerializer,
    MessageIsReadSerializer,
)

from apps.clients.models import Client

# from apps.analytics.services import message_creation
from apps.users.constants import USER_ROLE_TYPES
from apps.users.models import User
from apps.users.permissions import IsClient, IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404


class MessageViewSet(BaseViewset):
    """
    API endpoints that manages Ad Chat.
    """

    queryset = Chat.objects.all()

    action_serializers = {
        "default": ChatListSerializer,
        "start_chat": AdChatCreateSerializer,
        "list": ChatListSerializer,
        "chat_archived": ChatIsArchivedSerializer,
        "chat_read": MessageIsReadSerializer,
        "chat_message": ChatMessageSerializer,
        "message_create": AdMessageCreateSerializer,
    }

    action_permissions = {
        "default": [IsAuthenticated, IsVendorUser | IsClient],
        "start_chat": [IsAuthenticated, IsClient],
        "list": [IsAuthenticated, IsVendorUser | IsClient],
        "destroy": [IsAuthenticated, IsVendorUser | IsClient],
        "chat_archived": [IsAuthenticated, IsClient | IsVendorUser],
        "chat_read": [IsAuthenticated, IsClient | IsVendorUser],
        "chat_exist": [IsAuthenticated, IsClient],
        "chat_message": [IsAuthenticated, IsClient | IsVendorUser],
        "message_create": [IsAuthenticated, IsClient | IsVendorUser],
    }

    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Chat.objects.filter(
            ad__company__user_id=self.request.user.id, is_delete_vendor=False
        ).prefetch_related("chat_messages"),
        USER_ROLE_TYPES["CLIENT"]: lambda self: Chat.objects.filter(
            client__user_id=self.request.user.id, is_delete_client=False
        ).prefetch_related("chat_messages"),
    }

    def perform_create(self, serializer):
        # Associate the logged-in user with the object being created
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        data = super().list(request, *args, **kwargs)
        list_data = data.data
        queryset = self.get_queryset()
        archived_count = None

        if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            archived_count = queryset.filter(is_archived_client=True).count()
            inbox_count = queryset.filter(is_archived_client=False).count()
        elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            archived_count = queryset.filter(is_archived_vendor=True).count()
            inbox_count = queryset.filter(is_archived_vendor=False).count()

        list_data["inbox_count"] = inbox_count
        list_data["archived_count"] = archived_count
        return data

    @action(detail=False, url_path="start-chat", methods=["post"])
    def start_chat(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.validated_data.pop("message", {})
        ad = serializer.validated_data.get("ad", {})
        client = Client.objects.get(user=request.user)

        if not Chat.objects.filter(ad=ad, client=client).exists():
            chat = Chat.objects.create(**serializer.validated_data, client=client)
            msg = Message.objects.create(chat=chat, sender=request.user, text=message)
            chat.latest_message = msg
            chat.save()
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"id": chat.id},
                    status_code=status.HTTP_200_OK,
                    message="Chat has been created successfully",
                ),
            )
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_200_OK,
                message="Chat already exists",
            ),
        )

    @action(detail=True, url_path="archive", methods=["patch"])
    def chat_archived(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        chat = get_object_or_404(Chat.objects.filter(id=kwargs.get("pk")))

        is_archived = serializer.validated_data.get("is_archived", False)

        if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            chat.is_archived_client = is_archived
            chat.save()

        elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            chat.is_archived_vendor = is_archived
            chat.save()

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="Success"
            ),
        )

    @action(detail=True, url_path="chat-message", methods=["get"])
    def chat_message(self, request, *args, **kwargs):
        if Chat.objects.filter(id=kwargs.get("pk")).exists():
            chat = Chat.objects.filter(id=kwargs.get("pk")).first()
            chat.is_delete_client = False
            chat.is_delete_vendor = False
            chat.save()

            if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
                dic = {
                    "name": chat.ad.company.name,
                    "ad": chat.ad.id,
                    "image": chat.ad.company.user.image,
                }

            elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
                dic = {
                    "name": chat.client.user.first_name + chat.client.user.last_name,
                    "ad": chat.ad.id,
                    "image": chat.ad.company.user.image,
                }

            messages = Message.objects.filter(chat=chat).order_by("created_at")
            data = self.get_serializer(messages, many=True)

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"messages": data.data, "additional_info": dic},
                    status_code=status.HTTP_200_OK,
                    message="Success",
                ),
            )
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_200_OK,
                message="Not Found",
            ),
        )

    @action(detail=True, url_path="chat-read", methods=["patch"])
    def chat_read(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        chat = get_object_or_404(Chat.objects.filter(id=kwargs.get("pk")))
        is_read = serializer.validated_data.get("is_read", False)
        message = None

        if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            chat.is_read_client = is_read
            chat.save()
            message = "Client chat is marked to read"

        elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            chat.is_read_vendor = is_read
            chat.save()
            message = "Vendor chat is marked to read"

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message=message
            ),
        )

    @action(detail=True, url_path="chat-exist", methods=["get"])
    def chat_exist(self, request, *args, **kwargs):
        if Chat.objects.filter(
            client=request.user.client_profile, ad=kwargs.get("pk")
        ).exists():
            chat = Chat.objects.filter(
                client=request.user.client_profile, ad=kwargs.get("pk")
            ).first()
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"id": chat.id},
                    status_code=status.HTTP_200_OK,
                    message="Chat existes",
                ),
            )
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_200_OK,
                message="Chat does not existes",
            ),
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            instance.is_delete_client = True
        elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            instance.is_delete_vendor = True
        instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, url_path="message-create", methods=["post"])
    def message_create(self, request, *args, **kwargs):
        chat = Chat.objects.filter(id=kwargs.get("pk")).first()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = Message.objects.create(
            **serializer.validated_data, chat=chat, sender=request.user
        )
        serializer = ChatMessageSerializer(message)
        return Response(
            status=status.HTTP_201_CREATED,
            data=ResponseInfo().format_response(
                data=serializer.data,
                status_code=status.HTTP_201_CREATED,
                message="Message Created",
            ),
        )
