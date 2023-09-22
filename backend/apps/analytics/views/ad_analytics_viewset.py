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


class AnalyticViewSet(BaseViewset):
    """
    API endpoints that manages Analytics.
    """

    # queryset = Chat.objects.all()

    action_serializers = {
        "default": [],
    }

    action_permissions = {
        "default": [],
        "analytics": [IsAuthenticated, IsVendorUser],
    }

    # filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    # search_param = "search"
    # search_fields = [
    #     "client__user__first_name",
    #     "ad__name",
    #     "event_date",
    # ]
    # chat_filterset_fields = [
    #     "client__user__first_name",
    #     "ad__name",
    #     "event_date",
    # ]
    # ordering_fields = ["id"]
    # filterset_fields = {
    #     "client__user__first_name": ["exact"],
    #     "ad__name": ["exact"],
    #     "event_date": ["exact"],
    # }

    @action(detail=False, url_path="analytics", methods=["get"])
    def analytics(self, request, *args, **kwargs):
        total_chats = Chat.objects.filter()

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_200_OK,
                message="Chat already exists",
            ),
        )
