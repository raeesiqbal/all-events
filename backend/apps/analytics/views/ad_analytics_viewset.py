# imports
from apps.ads.serializers.get_serializers import AdDashboardSerializer
from apps.subscriptions.models import Subscription
from apps.users.serializers import GetUserDashboardSerializer
from apps.utils.constants import DATE_RANGE_MAPPING
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncDate
from django.utils import timezone
from django.db.models import Sum, F


# permissions
from apps.users.permissions import IsVerified, IsVendorUser
from rest_framework.permissions import IsAuthenticated


# constants
from apps.subscriptions.constants import SUBSCRIPTION_STATUS

# models
from apps.analytics.models import (
    AdReview,
    FavouriteAd,
    Message,
)
from apps.ads.models import Ad
from apps.subscriptions.models import Subscription

# serializers


class AnalyticViewSet(BaseViewset):
    """
    API endpoints that manages Analytics.
    """

    action_serializers = {
        "default": [],
    }

    action_permissions = {
        "default": [],
        "home": [IsAuthenticated, IsVerified, IsVendorUser],
        "fetch_fav_analytics": [IsAuthenticated, IsVerified, IsVendorUser],
        "fetch_review_analytics": [IsAuthenticated, IsVerified, IsVendorUser],
        "fetch_messages_analytics": [IsAuthenticated, IsVerified, IsVendorUser],
        "vendor_dashboard": [IsAuthenticated, IsVerified, IsVendorUser],
    }

    @action(detail=False, url_path="home", methods=["get"])
    def home(self, request, *args, **kwargs):
        ad = request.GET.get("ad")
        date_range = request.GET.get("date_range")
        subscription = Subscription.objects.filter(
            company__user=request.user, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()

        if subscription and subscription.type.analytics:
            vendor_ad_fav = FavouriteAd.objects.filter(ad__company__user=request.user)
            vendor_ad_reviews = AdReview.objects.filter(ad__company__user=request.user)
            vendor_ad_messages = Message.objects.filter(
                chat__ad__company__user=request.user
            )

            if ad:
                vendor_ad_fav = vendor_ad_fav.filter(ad_id=ad)
                vendor_ad_reviews = vendor_ad_reviews.filter(ad_id=ad)
                vendor_ad_messages = vendor_ad_messages.filter(chat__ad_id=ad)

            ad_favourite_analytics = []
            ad_review_analytics = []
            ad_message_analytics = []

            if DATE_RANGE_MAPPING.get(date_range, False):
                # Vendor ad favourite analytics
                vendor_ad_fav = vendor_ad_fav.filter(
                    created_at__gte=DATE_RANGE_MAPPING[date_range]
                )
                ad_fav_queryset = vendor_ad_fav.annotate(day=TruncDate("created_at"))
                ad_fav_queryset = ad_fav_queryset.values("day").annotate(
                    count=Count("id")
                )
                ad_favourite_analytics = [
                    {entry["day"].strftime("%Y-%m-%d"): entry["count"]}
                    for entry in ad_fav_queryset
                ]
                # Vendor ad reviews analytics
                vendor_ad_reviews = vendor_ad_reviews.filter(
                    created_at__gte=DATE_RANGE_MAPPING[date_range]
                )
                ad_reviews_queryset = vendor_ad_reviews.annotate(
                    day=TruncDate("created_at")
                )
                ad_reviews_queryset = ad_reviews_queryset.values("day").annotate(
                    count=Count("id")
                )
                ad_review_analytics = [
                    {entry["day"].strftime("%Y-%m-%d"): entry["count"]}
                    for entry in ad_reviews_queryset
                ]
                # Vendor ad messages analytics
                vendor_ad_messages = vendor_ad_messages.filter(
                    created_at__gte=DATE_RANGE_MAPPING[date_range]
                )
                ad_messages_queryset = vendor_ad_messages.annotate(
                    day=TruncDate("created_at")
                )
                ad_messages_queryset = ad_messages_queryset.values("day").annotate(
                    count=Count("id")
                )

                ad_message_analytics = [
                    {entry["day"].strftime("%Y-%m-%d"): entry["count"]}
                    for entry in ad_messages_queryset
                ]

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={
                        "total_ad_fav": vendor_ad_fav.count(),
                        "total_ad_reviews": vendor_ad_reviews.count(),
                        "total_ad_messages": vendor_ad_messages.count(),
                        "ad_favourite_analytics": ad_favourite_analytics,
                        "ad_review_analytics": ad_review_analytics,
                        "ad_message_analytics": ad_message_analytics,
                    },
                    status_code=status.HTTP_200_OK,
                    message="Analytics",
                ),
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Your plan do not support Analytics",
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

    @action(detail=False, url_path="dashboard", methods=["get"])
    def vendor_dashboard(self, request, *args, **kwargs):
        messages_count = None
        reviews_count = None
        vendor_ad_views = None
        fav_ads_count = None
        subscription = Subscription.objects.filter(
            company__user=request.user, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        vendor_ads = Ad.objects.filter(company__user=request.user)
        if subscription and subscription.type.analytics:
            messages_count = Message.objects.filter(
                chat__ad__company__user=request.user
            ).count()
            reviews_count = AdReview.objects.filter(
                ad__company__user=request.user
            ).count()
            fav_ads_count = FavouriteAd.objects.filter(
                ad__company__user=request.user
            ).count()
            vendor_ad_views = vendor_ads.aggregate(
                ads_total_views=Sum(F("total_views"))
            )["ads_total_views"]

        my_ads = AdDashboardSerializer(vendor_ads, many=True).data
        user_details = GetUserDashboardSerializer(request.user).data

        data = {
            "total_messages": messages_count,
            "total_reviews": reviews_count,
            "total_views": vendor_ad_views,
            "total_saves": fav_ads_count,
            "my_ads": my_ads,
            "user_details": user_details,
        }

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Company Dashboard",
            ),
        )
