
from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import action
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.ads.models import Category, SubCategory
from apps.ads.serializers.create_serializers import CategoryCreateSerializer
from apps.ads.serializers.get_serializers import (
    CategoryGetSerializer,
    RelatedSubCategoryGetSerializer,
)
from apps.ads.serializers.update_serializer import CategoryUpdateSerializer
from apps.users.models import User

from apps.users.permissions import IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo


class CategoryViewSet(BaseViewset):
    """
    API endpoints that manages company.
    """

    queryset = Category.objects.all()
    action_serializers = {
        "default": CategoryGetSerializer,
        "create": CategoryCreateSerializer,
        "partial_update": CategoryUpdateSerializer,
    }
    action_permissions = {
        "default": [IsAuthenticated, IsSuperAdmin],
        "create": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "list": [],
        "retrieve": [],
        "sub_categroy_from_categorys": [],
    }
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = []
    ordering_fields = []
    filterset_fields = {}

    @action(detail=True, url_path="sub-categroy-from-category", methods=["get"])
    def sub_categroy_from_categorys(self, request, *args, **kwargs):
        subs = SubCategory.objects.filter(category_id=kwargs["pk"])

        data = RelatedSubCategoryGetSerializer(subs, many=True).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Sub categories",
            ),
        )
