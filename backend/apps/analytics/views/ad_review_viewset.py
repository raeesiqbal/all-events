# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg

# constants
from apps.subscriptions.constants import SUBSCRIPTION_STATUS

# permissions
from apps.users.permissions import IsClient, IsVerified
from rest_framework.permissions import IsAuthenticated

# serializers
from apps.analytics.serializers.create_serializer import (
    AdReviewCreateSerializer,
)
from apps.analytics.serializers.get_serializer import (
    AdReviewGetSerializer,
)

# models
from apps.analytics.models import AdReview
from apps.ads.models import Ad
from apps.subscriptions.models import Subscription


class AdReviewViewSet(BaseViewset):
    """
    API endpoints that manages Ad Review ViewSet.
    """

    queryset = AdReview.objects.all()
    action_serializers = {
        "default": AdReviewGetSerializer,
        "ad_reviews": AdReviewGetSerializer,
        "custom_create": AdReviewCreateSerializer,
    }
    action_permissions = {
        "custom_create": [IsAuthenticated, IsVerified, IsClient],
        "ad_reviews": [],
    }

    @action(detail=True, url_path="list", methods=["get"])
    def public_ad_reviews(self, request, *args, **kwargs):
        queryset = AdReview.objects.filter(ad__id=kwargs.get("pk")).order_by(
            "-created_at"
        )
        avg = queryset.aggregate(Avg("rating"))
        avg = avg["rating__avg"]
        data = []

        if len(queryset):
            queryset = self.filter_queryset(queryset)
            page = self.paginate_queryset(queryset)

            if page != None:
                serializer = AdReviewGetSerializer(page, many=True)
            else:
                serializer = AdReviewGetSerializer(queryset, many=True)

            data = serializer.data
            if page != None:
                data = self.get_paginated_response(data).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"avg": avg, "reviews": data},
                status_code=status.HTTP_200_OK,
                message="Review List",
            ),
        )

    @action(detail=True, url_path="review-create", methods=["post"])
    def custom_create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ad = Ad.objects.filter(id=kwargs.get("pk")).first()
        ad_company_subscription = Subscription.objects.filter(
            company=ad.company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        if ad_company_subscription and ad_company_subscription.type.reviews:
            if not AdReview.objects.filter(
                client=request.user.client_profile, ad=ad
            ).exists():
                ad_review = AdReview.objects.create(
                    **serializer.validated_data,
                    client=request.user.client_profile,
                    ad=ad
                )
                serialzier = AdReviewGetSerializer(ad_review)
                return Response(
                    status=status.HTTP_201_CREATED,
                    data=ResponseInfo().format_response(
                        data=serialzier.data,
                        status_code=status.HTTP_201_CREATED,
                        message="Review created",
                    ),
                )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Action not allowed",
            ),
        )
