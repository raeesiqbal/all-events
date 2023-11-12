# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from apps.utils.services.s3_service import S3Service
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status


# permissions
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsSuperAdmin, IsVendorUser

# constant
from apps.users.constants import USER_ROLE_TYPES

# serializers
from apps.ads.serializers.create_serializers import GetUploadPresignedUrlSerializer
from apps.companies.serializers.create_serializers import VendorCreateSerializer
from apps.companies.serializers.get_serializers import (
    CompanyListSerializer,
    CompanyRetrieveSerializer,
)
from apps.companies.serializers.update_serializers import VendorUpdateSerializer


# models
from apps.users.models import User
from apps.companies.models import Company


class CompanyViewSet(BaseViewset):
    """
    API endpoints that manages company.
    """

    queryset = Company.objects.all()
    action_serializers = {
        "default": CompanyListSerializer,
        "list": CompanyListSerializer,
        "create": VendorCreateSerializer,
        "retrieve": CompanyRetrieveSerializer,
        "partial_update": VendorUpdateSerializer,
        "upload_company_image": GetUploadPresignedUrlSerializer,
    }
    action_permissions = {
        "default": [],
        "create": [],
        "retrieve": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "list": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "partial_update": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "public_companies_list": [],
        "public_company_retrieve": [],
        "upload_company_image": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "verify_account_email": [],
    }
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = []
    ordering_fields = []
    filterset_fields = {}

    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Company.objects.filter(
            user_id=self.request.user.id
        )
    }

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_details = serializer.validated_data.pop("user")

        user = User.objects.create(**user_details, role_type=USER_ROLE_TYPES["VENDOR"])
        # Setting password.
        user.set_password(user_details["password"])
        user.save()
        Company.objects.create(**serializer.validated_data, user=user)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, message="obje created", status_code=status.HTTP_200_OK
            ),
        )

    @action(detail=False, url_path="public-list", methods=["get"])
    def public_companies_list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(Company.objects.all())
        page = self.paginate_queryset(queryset)

        if page != None:
            serializer = self.get_serializer(page, many=True)
        else:
            serializer = self.get_serializer(queryset, many=True)

        data = serializer.data
        if page != None:
            data = self.get_paginated_response(data).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Companies List"
            ),
        )

    @action(detail=True, url_path="public-get", methods=["get"])
    def public_company_retrieve(self, request, *args, **kwargs):
        obj = self.queryset.filter(id=kwargs["pk"]).first()
        serializer = self.get_serializer(obj)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=serializer.data,
                status_code=status.HTTP_200_OK,
                message="Companies get",
            ),
        )

    @action(detail=False, url_path="upload-company-image", methods=["post"])
    def upload_company_image(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        company = request.user.user_company

        file = serializer.validated_data.get("file")
        content_type = serializer.validated_data.get("content_type")
        upload_folder = f"vendors/{request.user.email}/profile"
        image_url = None
        # # Uploading resume to S3.
        s3_service = S3Service()
        image_url = s3_service.upload_file(file, content_type, upload_folder)

        if company.image:
            self.s3_service.delete_s3_object_by_url(company.image)
        company.image = image_url
        company.save()
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"file_url": image_url},
                status_code=status.HTTP_200_OK,
                message="company image uploaded",
            ),
        )
