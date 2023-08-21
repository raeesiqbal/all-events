
from rest_framework.permissions import IsAuthenticated
from apps.analytics.models import Chat,Message

from apps.analytics.serializers.create_serializer import AdChatCreateSerializer, FavouriteAdCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from apps.analytics.serializers.get_serializer import ChatListSerializer
from apps.analytics.serializers.update_serializer import ChatIsArchivedSerializer, MessageIsReadSerializer
from apps.analytics.services import message_creation
from apps.users.constants import USER_ROLE_TYPES
from apps.users.models import User
from apps.users.permissions import IsClient, IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action


class MessageViewSet(BaseViewset):
    """
    API endpoints that manages Ad Chat.
    """

    queryset = Chat.objects.all()
    action_serializers = {
        "default": ChatListSerializer,
        "post_message": AdChatCreateSerializer,
        "list":ChatListSerializer,
        "chat_archived":ChatIsArchivedSerializer,
        "message_read":MessageIsReadSerializer
    }
    action_permissions = {
        "default": [IsAuthenticated,IsVendorUser| IsClient],
        "post_message": [IsAuthenticated, IsVendorUser| IsClient],
        "list": [IsAuthenticated,IsVendorUser| IsClient],
        "chat_archived":[IsAuthenticated, IsClient],
        "message_read":[IsAuthenticated,IsVendorUser]
    }
    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Chat.objects.filter(
            ad__company__user_id=self.request.user.id
        ).prefetch_related('chat_messages'),
        USER_ROLE_TYPES["CLIENT"]: lambda self: Chat.objects.filter(
            client__user_id=self.request.user.id
        ).prefetch_related('chat_messages')
    }

    @action(detail=False, url_path="message-send", methods=["post"])
    def post_message(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        client=serializer.validated_data.get("client")
        ad=serializer.validated_data.get("ad")
        chat_messages=serializer.validated_data.pop("chat_messages",[])
      
        chat=Chat.objects.filter(client_id=client.id,ad_id=ad.id)
       
        if chat.exists():
            
            message_creation(chat_messages,chat.first())
        else:
            chat_created=Chat.objects.create(**serializer.validated_data)
            message_creation(chat_messages,chat_created)

        
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="message posted"
            ),
        )
    
    @action(detail=True, url_path="archive", methods=["patch"])
    def chat_archived(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id=kwargs.get("pk")
        
        Chat.objects.filter(id=id).update(is_archived=serializer.validated_data.get("is_archived"))

        
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="chat archived"
            ),
        )
    
    @action(detail=False, url_path="message-read", methods=["patch"])
    def message_read(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        Message.objects.filter(id=serializer.validated_data.get("message_id")).update(is_read=serializer.validated_data.get("is_read"))

        
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="message read"
            ),
        )
    

    

