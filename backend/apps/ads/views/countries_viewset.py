from datetime import date

from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import action
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.ads.models import Country
from apps.ads.serializers.create_serializers import CountryCreateSerializer
from apps.ads.serializers.get_serializers import CountryGetSerializer
from apps.ads.serializers.update_serializer import CountryUpdateSerializer
from apps.users.models import User

from apps.users.permissions import IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo


class CountryViewSet(BaseViewset):
    """
    API endpoints that manages company.
    """

    queryset = Country.objects.all()
    action_serializers = {
        "default": CountryGetSerializer,
        "create": CountryCreateSerializer,
        "partial_update": CountryUpdateSerializer,
    }
    action_permissions = {
        "default": [IsAuthenticated, IsSuperAdmin],
        "create": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "list": [],
        "retrieve": [],
    }
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = []
    ordering_fields = []
    filterset_fields = {}
