# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# models
from apps.ads.models import ActivationSubCategory, RelatedSubCategory, SubCategory

# serializers
from apps.ads.serializers.create_serializers import SubCategoryCreateSerializer
from apps.ads.serializers.get_serializers import (
    RelatedSubCategoryGetSerializer,
    SubCategoryGetSerializer,
)
from apps.ads.serializers.update_serializer import SubCategoryUpdateSerializer

# permissions
from apps.users.permissions import IsSuperAdmin, IsVendorUser


class SubCategoryViewSet(BaseViewset):
    """
    API endpoints that manages company.
    """

    queryset = SubCategory.objects.all()
    action_serializers = {
        "default": SubCategoryGetSerializer,
        "create": SubCategoryCreateSerializer,
        "partial_update": SubCategoryUpdateSerializer,
    }
    action_permissions = {
        "default": [],
        "create": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "list": [],
        "retrieve": [],
        "public_related_subcategory": [],
        "public_activation_countries_exists": [],
    }
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = []
    ordering_fields = []
    filterset_fields = {}

    @action(detail=True, url_path="public-related", methods=["get"])
    def public_related_subcategory(self, request, *args, **kwargs):
        sub_category = SubCategory.objects.filter(id=kwargs["pk"]).first()

        if RelatedSubCategory.objects.filter(sub_category_1=sub_category).exists():
            related_sub_cat = RelatedSubCategory.objects.filter(
                sub_category_1=sub_category
            ).first()
            data = RelatedSubCategoryGetSerializer(related_sub_cat.sub_category_2).data
        elif RelatedSubCategory.objects.filter(sub_category_2=sub_category).exists():
            related_sub_cat = RelatedSubCategory.objects.filter(
                sub_category_2=sub_category
            ).first()
            data = RelatedSubCategoryGetSerializer(related_sub_cat.sub_category_1).data
        else:
            data = {}

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Related Sub categories Get",
            ),
        )

    @action(detail=True, url_path="activation-countries-exists", methods=["get"])
    def public_activation_countries_exists(self, request, *args, **kwargs):
        activation_country = ActivationSubCategory.objects.filter(
            sub_category_id=kwargs["pk"]
        ).exists()

        data = {"activation_country": activation_country}

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Sub categories Exists",
            ),
        )
