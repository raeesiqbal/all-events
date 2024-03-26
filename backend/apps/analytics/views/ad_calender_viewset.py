# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta

# constants
from apps.users.constants import USER_ROLE_TYPES
from apps.subscriptions.constants import SUBSCRIPTION_STATUS

# permissions
from apps.users.permissions import IsVendorUser, IsVerified
from rest_framework.permissions import IsAuthenticated

# serializers
from apps.analytics.serializers.create_serializer import (
    CalenderCreateSerializer,
)
from apps.analytics.serializers.get_serializer import (
    CalenderGetSerializer,
)

from apps.analytics.serializers.update_serializer import (
    CalenderAvailabilityUpdateSerializer,
    CalenderUpdateSerializer,
)

# models
from apps.analytics.models import Calender
from apps.subscriptions.models import Subscription


class AdCalenderViewSet(BaseViewset):
    """
    API endpoints that manages Ad Calender ViewSet.
    """

    queryset = Calender.objects.all()
    action_serializers = {
        "default": CalenderGetSerializer,
        "create": CalenderCreateSerializer,
        "vendor_calender_list": CalenderGetSerializer,
        "set_calender_availability": CalenderAvailabilityUpdateSerializer,
        "update_calender": CalenderUpdateSerializer,
    }
    action_permissions = {
        "default": [IsAuthenticated, IsVendorUser],
        "create": [IsAuthenticated, IsVerified, IsVendorUser],
        "vendor_calender_list": [IsAuthenticated, IsVendorUser],
        "set_calender_availability": [IsAuthenticated, IsVerified, IsVendorUser],
        "update_calender": [IsAuthenticated, IsVerified, IsVendorUser],
    }
    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Calender.objects.filter(
            company__user_id=self.request.user.id
        )
    }

    @action(detail=True, url_path="set-calender-availability", methods=["post"])
    def set_calender_availability(self, request, *args, **kwargs):
        subscription = Subscription.objects.filter(
            company=request.user.user_company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        if subscription and subscription.type.calender:
            if Calender.objects.filter(
                id=kwargs["pk"], company=request.user.user_company
            ).exists():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                hide = serializer.validated_data.get("hide", False)
                calender = Calender.objects.filter(id=kwargs["pk"]).first()
                calender.hide = hide
                calender.save()
                serializer = CalenderGetSerializer(calender).data
                return Response(
                    status=status.HTTP_200_OK,
                    data=ResponseInfo().format_response(
                        data=serializer,
                        status_code=status.HTTP_200_OK,
                        message="Calender avalability is updated",
                    ),
                )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data=[],
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Action not allowed",
            ),
        )

    @action(detail=True, url_path="update-calender", methods=["post"])
    def update_calender(self, request, *args, **kwargs):
        subscription = Subscription.objects.filter(
            company=request.user.user_company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        if subscription and subscription.type.calender:
            print(request.data)
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            calendar = Calender.objects.filter(id=kwargs["pk"]).first()
            start_date = serializer.validated_data.get("start_date")
            end_date = serializer.validated_data.get("end_date")

            dates_list = [
                (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
                for i in range((end_date - start_date).days + 1)
            ]
            reason = serializer.validated_data.get("reason", {})
            availability = serializer.validated_data.get("availability", {})
            for i in dates_list:
                if calendar.dates and i in calendar.dates:
                    if availability == "ad":
                        calendar.dates[i] = reason
                    if availability == "remove":
                        del calendar.dates[i]
                else:
                    if availability == "ad":
                        calendar.dates[i] = reason
            calendar.save()
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=[],
                    status_code=status.HTTP_200_OK,
                    message="Calender updated",
                ),
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data=[],
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Action not allowed",
            ),
        )
