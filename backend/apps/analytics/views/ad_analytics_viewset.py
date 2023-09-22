# imports
from apps.utils.constants import DATE_RANGE_MAPPING
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta

# filters
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

# permissions
from apps.users.permissions import IsClient, IsVendorUser
from rest_framework.permissions import IsAuthenticated


# constants
from apps.users.constants import USER_ROLE_TYPES

# models
from apps.analytics.models import AdReview, Chat, FavouriteAd, Message
from apps.clients.models import Client
from apps.ads.models import Ad

# serializers
from apps.analytics.serializers.get_serializer import (
    AnalyticAdChildSerializer,
)


class AnalyticViewSet(BaseViewset):
    """
    API endpoints that manages Analytics.
    """

    action_serializers = {
        "default": [],
        "home": AnalyticAdChildSerializer,
    }

    action_permissions = {
        "default": [],
        "home": [IsAuthenticated, IsVendorUser],
        "fetch_fav_analytics": [IsAuthenticated, IsVendorUser],
        "fetch_review_analytics": [IsAuthenticated, IsVendorUser],
        "fetch_messages_analytics": [IsAuthenticated, IsVendorUser],
    }

    @action(detail=False, url_path="home", methods=["get"])
    def home(self, request, *args, **kwargs):
        ad = request.GET.get("ad")
        vendor_ads = Ad.objects.filter(company__user=request.user)
        vendor_ad_fav = FavouriteAd.objects.filter(ad__company__user=request.user)
        vendor_ad_reviews = AdReview.objects.filter(ad__company__user=request.user)
        vendor_ad_messages = Message.objects.filter(
            chat__ad__company__user=request.user
        )

        if ad:
            vendor_ad_fav = vendor_ad_fav.filter(ad_id=ad)
            vendor_ad_reviews = vendor_ad_reviews.filter(ad_id=ad)
            vendor_ad_messages = vendor_ad_messages.filter(chat__ad_id=ad)

        serializer = self.get_serializer(vendor_ads, many=True).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "vendor_ads": serializer,
                    "total_ad_fav": vendor_ad_fav.count(),
                    "total_ad_reviews": vendor_ad_reviews.count(),
                    "total_ad_messages": vendor_ad_messages.count(),
                },
                status_code=status.HTTP_200_OK,
                message="Analytics Home",
            ),
        )

    @action(detail=False, url_path="favourites", methods=["get"])
    def fetch_fav_analytics(self, request, *args, **kwargs):
        date_range = request.GET.get("date_range")
        ad = request.GET.get("ad")
        vendor_ad_fav = FavouriteAd.objects.filter(ad__company__user=request.user)

        result = []
        if ad:
            vendor_ad_fav = vendor_ad_fav.filter(ad_id=ad)

        if DATE_RANGE_MAPPING.get(date_range, False):
            queryset = vendor_ad_fav.filter(
                created_at__gte=DATE_RANGE_MAPPING[date_range]
            )
            queryset = queryset.annotate(day=TruncDate("created_at"))
            queryset = queryset.values("day").annotate(count=Count("id"))

            result = [
                {entry["day"].strftime("%Y-%m-%d"): entry["count"]}
                for entry in queryset
            ]

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "result": result,
                    "start_period": DATE_RANGE_MAPPING[date_range],
                    "end_period": timezone.now(),
                },
                status_code=status.HTTP_200_OK,
                message="Fav Analytics",
            ),
        )

    @action(detail=False, url_path="reviews", methods=["get"])
    def fetch_review_analytics(self, request, *args, **kwargs):
        date_range = request.GET.get("date_range")
        ad = request.GET.get("ad")
        vendor_ad_reviews = AdReview.objects.filter(ad__company__user=request.user)

        result = []
        if ad:
            vendor_ad_reviews = vendor_ad_reviews.filter(ad_id=ad)

        if DATE_RANGE_MAPPING.get(date_range, False):
            queryset = vendor_ad_reviews.filter(
                created_at__gte=DATE_RANGE_MAPPING[date_range]
            )
            queryset = queryset.annotate(day=TruncDate("created_at"))
            queryset = queryset.values("day").annotate(count=Count("id"))

            result = [
                {entry["day"].strftime("%Y-%m-%d"): entry["count"]}
                for entry in queryset
            ]

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "result": result,
                    "start_period": DATE_RANGE_MAPPING[date_range],
                    "end_period": timezone.now(),
                },
                status_code=status.HTTP_200_OK,
                message="Review Analytics",
            ),
        )

    @action(detail=False, url_path="messages", methods=["get"])
    def fetch_messages_analytics(self, request, *args, **kwargs):
        date_range = request.GET.get("date_range")
        ad = request.GET.get("ad")
        vendor_ad_messages = Message.objects.filter(
            chat__ad__company__user=request.user
        )

        result = []
        if ad:
            vendor_ad_messages = vendor_ad_messages.filter(chat__ad_id=ad)

        if DATE_RANGE_MAPPING.get(date_range, False):
            queryset = vendor_ad_messages.filter(
                created_at__gte=DATE_RANGE_MAPPING[date_range]
            )
            queryset = queryset.annotate(day=TruncDate("created_at"))
            queryset = queryset.values("day").annotate(count=Count("id"))

            result = [
                {entry["day"].strftime("%Y-%m-%d"): entry["count"]}
                for entry in queryset
            ]

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "result": result,
                    "start_period": DATE_RANGE_MAPPING[date_range],
                    "end_period": timezone.now(),
                },
                status_code=status.HTTP_200_OK,
                message="Message Analytics",
            ),
        )
