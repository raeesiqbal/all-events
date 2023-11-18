# imports
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

# models
from apps.ads.models import FAQ

# serializers
from apps.ads.serializers.create_serializers import FaqsCreateSerializer
from apps.ads.serializers.get_serializers import FaqsGetSerializer
from apps.ads.serializers.update_serializer import FaqsUpdateSerializer

# permissions
from apps.users.permissions import (
    IsSuperAdmin,
    IsVendorUser,
    IsVerified,
)
from rest_framework.permissions import IsAuthenticated


from apps.utils.views.base import BaseViewset


class FaqsViewSet(BaseViewset):
    """
    API endpoints that manages Faqs.
    """

    queryset = FAQ.objects.all()
    action_serializers = {
        "default": FaqsGetSerializer,
        "create": FaqsCreateSerializer,
        "partial_update": FaqsUpdateSerializer,
    }
    action_permissions = {
        "default": [IsAuthenticated],
        "create": [IsAuthenticated, IsVerified, IsSuperAdmin | IsVendorUser],
        "list": [],
        "retrieve": [],
        "partial_update": [],
    }
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = []
    ordering_fields = []
    filterset_fields = {}
