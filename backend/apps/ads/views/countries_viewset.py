# imports
from apps.utils.views.base import BaseViewset
from rest_framework.permissions import IsAuthenticated

# permissions
from apps.users.permissions import IsSuperAdmin, IsVendorUser

# serializers
from apps.ads.serializers.create_serializers import CountryCreateSerializer
from apps.ads.serializers.get_serializers import CountryGetSerializer
from apps.ads.serializers.update_serializer import CountryUpdateSerializer

# models
from apps.ads.models import Country


class CountryViewSet(BaseViewset):
    """
    API endpoints that manages company.
    """

    queryset = Country.objects.all().order_by("name")
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
