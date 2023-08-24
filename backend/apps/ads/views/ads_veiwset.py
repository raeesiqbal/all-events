from datetime import date, datetime
import os
from django.conf import settings
from django.template.loader import render_to_string
from django.db.models import Value

from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import action
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.ads.models import FAQ, Ad, Category, Gallery, SubCategory
from apps.ads.serializers.create_serializers import (
    AdCreateSerializer,
    DeleteUrlOnUpdateSerializer,
    DeleteUrlSerializer,
    GetUploadPresignedUrlSerializer,
    SearchStringSerializer,
)
from apps.ads.serializers.get_serializers import AdGetSerializer, AdPublicGetSerializer, SuggestionGetSerializer
from apps.ads.serializers.update_serializer import AdUpdateSerializer
from apps.companies.models import Company
from apps.users.constants import USER_ROLE_TYPES
from apps.users.models import User
from django.db.models import F

from apps.users.permissions import IsSuperAdmin, IsVendorUser
from apps.utils.services.email_service import send_email_to_user
from apps.utils.services.s3_service import S3Service
from apps.utils.views.base import BaseViewset, ResponseInfo


class AdViewSet(BaseViewset):
    """
    API endpoints that manages company.
    """

    queryset = Ad.objects.all()
    action_serializers = {
        "default": AdPublicGetSerializer,
        "create": AdCreateSerializer,
        "partial_update": AdUpdateSerializer,
        "get_upload_url": GetUploadPresignedUrlSerializer,
        "delete_url": DeleteUrlSerializer,
        "remove_url_on_update":DeleteUrlOnUpdateSerializer,
        "list":AdGetSerializer,
        "retrieve":AdGetSerializer,
        "fetch_suggestion_list":SearchStringSerializer

    }
    action_permissions = {
        "default": [],
        "create": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "list": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "retrieve": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "partial_update": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "destroy": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "get_upload_url": [],
        "remove_url_on_update":[IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "fetch_suggestion_list":[]
    }
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = "search"
    search_fields = ['name','company__name','country__name','sub_category__name','related_sub_category__name','activation_countries__name','city'
                     'street','offered_services']
    ordering_fields = ['name','sub_category__name','id']
    filterset_fields = {
        "sub_category__category__name":["iexact"],
        "sub_category__name":["iexact"],
        "name":["iexact"]
    }
    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Ad.objects.filter(
            company__user_id=self.request.user.id
        )
    }

    s3_service = S3Service()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        media_urls = serializer.validated_data.pop("media_urls", {})

        faqs = serializer.validated_data.pop("faqs", [])
        activation_countries = serializer.validated_data.pop("activation_countries", [])
        company = Company.objects.filter(user_id=request.user.id).first()
        if company:
            ad = Ad.objects.create(**serializer.validated_data, company=company)
            ad.activation_countries.add(*activation_countries)

            """ads gallery created"""

            Gallery.objects.create(ad=ad, media_urls=media_urls)

            # ad faqs
            faqs_list = []
            for faq in faqs:
                faqs_list.append(FAQ(**faq, ad=ad))

            FAQ.objects.bulk_create(faqs_list)

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=AdGetSerializer(ad).data,
                    status_code=status.HTTP_200_OK,
                    message="Ad created",
                ),
            )
        else:
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={}, status_code=status.HTTP_200_OK, message="Ad cannot created"
                ),
            )

    @action(detail=False, url_path="upload-url", methods=["post"])
    def get_upload_url(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data.get("file")
        content_type = serializer.validated_data.get("content_type")

        file_url = None
        # # Uploading resume to S3.
        s3_service = S3Service()
        file_url = s3_service.upload_file(file, content_type)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"file_url": file_url},
                status_code=status.HTTP_200_OK,
                message="uploads media.",
            ),
        )

    @action(detail=False, url_path="delete-url", methods=["post"])
    def delete_url(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.s3_service.delete_s3_object_by_url(serializer.validated_data.get("url"))
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="delete media"
            ),
        )

    @action(detail=False, url_path="public-list", methods=["get"])
    def public_ads_list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(Ad.objects.all())
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
                data=data, status_code=status.HTTP_200_OK, message="Ads List"
            ),
        )

    @action(detail=True, url_path="public-get", methods=["get"])
    def public_ad_retrieve(self, request, *args, **kwargs):
        obj = self.queryset.filter(id=kwargs["pk"]).first()
        serializer = self.get_serializer(obj)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=serializer.data, status_code=status.HTTP_200_OK, message="Ads Get"
            ),
        )
    
    def partial_update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        faqs = serializer.validated_data.pop("faqs", [])
        media_urls = serializer.validated_data.pop("media_urls", {})

        activation_countries = serializer.validated_data.pop("activation_countries", [])
        ad=Ad.objects.filter(id=kwargs.get('pk'))
        ad.first().activation_countries.clear()
        ad.first().activation_countries.add(*activation_countries)
        ad.update(**serializer.validated_data)
        Gallery.objects.filter(ad=ad.first()).update(media_urls=media_urls)

        FAQ.objects.filter(ad=ad.first()).delete()

        # ad faqs
        faqs_list = []
        for faq in faqs:
            faqs_list.append(FAQ(**faq, ad=ad.first()))

        FAQ.objects.bulk_create(faqs_list)

            
        
        return  Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=AdGetSerializer(ad.first()).data, status_code=status.HTTP_200_OK, message="Ads Get"
            ),
        )
    

    @action(detail=True, url_path="remove-url", methods=["post"])
    def remove_url_on_update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        media_type=serializer.validated_data.get("media_type")
        gallery_obj=Gallery.objects.filter(ad_id=kwargs['pk']).first()
        url=serializer.validated_data.get("url")
       
        media=gallery_obj.media_urls.get(media_type,[])
        if url in media:
            media.remove(url)
            gallery_obj.media_urls[media_type] = media
            gallery_obj.save()
            
        self.s3_service.delete_s3_object_by_url(serializer.validated_data.get("url"))
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="delete media on update"
            ),
        )
    
    @action(detail=False, url_path="view-effect", methods=["get"])
    def increment_view_effect(self, request, *args, **kwargs):
        slug=request.GET.get("slug")
        obj = self.queryset.filter(slug=slug)
        if len(obj):
            obj.update(total_views=F("total_views")+1)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="Ads Get"
            ),
        )
    
    @action(detail=False, url_path="suggestion-list", methods=["post"])
    def fetch_suggestion_list(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        search_string=serializer.validated_data.get('search_string')
        
        categories=Category.objects.filter(name__icontains=search_string).values('name').annotate(type=Value('category'))
        categories_dict_list=list(categories)
        
        sub_categories=SubCategory.objects.filter(name__icontains=search_string).values('name').annotate(type=Value('sub_categories'))
        sub_categories_dict_list=list(sub_categories)
        
        ad=Ad.objects.filter(name__icontains=search_string).values('name').annotate(type=Value('commercial_name'))
        ad_dict_list=list(ad)
        
        data_list=categories_dict_list+sub_categories_dict_list+ad_dict_list
        data=SuggestionGetSerializer(data_list,many=True).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Ads Get"
            ),
        )
    