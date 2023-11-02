# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

# filters
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

# permissions
from apps.users.permissions import IsClient, IsVendorUser
from rest_framework.permissions import IsAuthenticated


# constants
from apps.users.constants import USER_ROLE_TYPES

# models
from apps.analytics.models import Chat, Message
from apps.clients.models import Client
from apps.ads.models import Ad

# serializers
from apps.analytics.serializers.get_serializer import (
    ChatListSerializer,
    ChatMessageSerializer,
)
from apps.analytics.serializers.update_serializer import (
    ChatIsArchivedSerializer,
    MessageIsReadSerializer,
)
from apps.analytics.serializers.create_serializer import (
    AdChatCreateSerializer,
    AdMessageCreateSerializer,
)


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
        "chat_suggestion_list": [IsAuthenticated, IsClient | IsVendorUser],
    }

    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Chat.objects.filter(
            ad__company__user_id=self.request.user.id, is_delete_vendor=False
        ).prefetch_related("chat_messages"),
        USER_ROLE_TYPES["CLIENT"]: lambda self: Chat.objects.filter(
            client__user_id=self.request.user.id, is_delete_client=False
        ).prefetch_related("chat_messages"),
    }

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = [
        "client__user__first_name",
        "ad__name",
        "event_date",
    ]
    chat_filterset_fields = [
        "client__user__first_name",
        "ad__name",
        "event_date",
    ]
    # ordering_fields = ["id"]
    filterset_fields = {
        "client__user__first_name": ["exact"],
        "ad__name": ["exact"],
        "event_date": ["exact"],
    }

    def perform_create(self, serializer):
        # Associate the logged-in user with the object being created
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            instance.is_delete_client = True
        elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            instance.is_delete_vendor = True
        instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        archived_count = None
        archived = request.GET.get("archived")

        if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            archived_count = queryset.filter(is_archived_client=True).count()
            inbox_count = queryset.filter(is_archived_client=False).count()
            queryset = self.filter_queryset(self.get_queryset())
            chats = queryset.filter(is_archived_client=archived)

        elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            archived_count = queryset.filter(is_archived_vendor=True).count()
            inbox_count = queryset.filter(is_archived_vendor=False).count()
            queryset = self.filter_queryset(self.get_queryset())
            chats = queryset.filter(is_archived_vendor=archived)

        inbox_count = inbox_count
        archived_count = archived_count

        page = self.paginate_queryset(chats)
        if page != None:
            serializer = self.get_serializer(page, many=True)
        else:
            serializer = self.get_serializer(
                chats,
                many=True,
            )

        data = serializer.data
        if page != None:
            data = self.get_paginated_response(data).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "chats": data,
                    "inbox_count": inbox_count,
                    "archived_count": archived_count,
                },
                status_code=status.HTTP_200_OK,
                message="Chats List",
            ),
        )

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
                chat.is_read_client = True
                chat.save()
                dic = {
                    "event_date": chat.event_date,
                    "name": chat.ad.company.name,
                    "ad": chat.ad.id,
                    "image": chat.ad.company.user.image,
                }

            elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
                chat.is_read_vendor = True
                chat.save()
                dic = {
                    "event_date": chat.event_date,
                    "name": chat.client.user.first_name + chat.client.user.last_name,
                    "ad": chat.ad.id,
                    "image": chat.ad.company.user.image,
                }

            messages = Message.objects.filter(chat=chat).order_by("-created_at")

            page = self.paginate_queryset(messages)

            if page != None:
                serializer = self.get_serializer(page, many=True)
            else:
                serializer = self.get_serializer(
                    messages,
                    many=True,
                )
            data = serializer.data
            if page != None:
                data = self.get_paginated_response(data).data

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"messages": data, "additional_info": dic},
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

    @action(detail=True, url_path="message-create", methods=["post"])
    def message_create(self, request, *args, **kwargs):
        chat = Chat.objects.filter(id=kwargs.get("pk")).first()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = Message.objects.create(
            **serializer.validated_data, chat=chat, sender=request.user
        )

        if request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            chat.is_read_vendor = False
        elif request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            chat.is_read_client = False

        chat.latest_message = message

        chat.save()

        serializer = ChatMessageSerializer(message)

        return Response(
            status=status.HTTP_201_CREATED,
            data=ResponseInfo().format_response(
                data=serializer.data,
                status_code=status.HTTP_201_CREATED,
                message="Message Created",
            ),
        )

    @action(detail=False, url_path="chat-suggestion-list", methods=["get"])
    def chat_suggestion_list(self, request, *args, **kwargs):
        keyword_type = request.GET.get("keyword_type")
        keyword = request.GET.get("keyword")

        sender_names = None
        ad_names = None

        chats = self.get_queryset()

        if keyword_type == "ad_name":
            ads_queryset = Ad.objects.filter(ad_chats__in=chats)

            ad_names = list(
                ads_queryset.filter(name__icontains=keyword)
                .values_list("name", flat=True)
                .distinct()
            )
            ad_names = set(ad_names)
            ad_names = list(ad_names)
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=ad_names,
                    status_code=status.HTTP_200_OK,
                    message="Chat Suggestions",
                ),
            )
        elif keyword_type == "sender_name":
            sender_names = (
                Client.objects.filter(my_chats__in=chats)
                .prefetch_related("user")
                .all()
                .filter(user__first_name__icontains=keyword)
                .values_list("user__first_name", flat=True)
                .distinct()
            )
            sender_names = set(sender_names)
            sender_names = list(sender_names)

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=sender_names,
                    status_code=status.HTTP_200_OK,
                    message="Chat Suggestions",
                ),
            )
