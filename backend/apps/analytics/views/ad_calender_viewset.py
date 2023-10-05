# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg

# constants
from apps.users.constants import USER_ROLE_TYPES

# permissions
from apps.users.permissions import IsClient, IsVendorUser
from rest_framework.permissions import IsAuthenticated

# serializers
from apps.analytics.serializers.create_serializer import (
    CalenderCreateSerializer,
)
from apps.analytics.serializers.get_serializer import (
    CalenderGetSerializer,
    AdCalenderGetSerializer,
)

from apps.analytics.serializers.update_serializer import (
    CalenderAvailabilityUpdateSerializer,
)

# models
from apps.analytics.models import AdReview, Calender
from apps.ads.models import Ad


class AdCalenderViewSet(BaseViewset):
    """
    API endpoints that manages Ad Calender ViewSet.
    """

    queryset = Calender.objects.all()
    action_serializers = {
        "default": CalenderGetSerializer,
        "ad_calender": AdCalenderGetSerializer,
        "create": CalenderCreateSerializer,
        "vendor_calender_list": CalenderGetSerializer,
        "set_calender_availability": CalenderAvailabilityUpdateSerializer,
    }
    action_permissions = {
        "ad_calender": [],
        "default": [IsAuthenticated | IsVendorUser],
        "create": [IsAuthenticated | IsVendorUser],
        "vendor_calender_list": [IsAuthenticated, IsVendorUser],
        "set_calender_availability": [IsAuthenticated, IsVendorUser],
    }
    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: Calender.objects.filter(
            company__user_id=self.request.user.id
        )
    }

    @action(detail=True, url_path="ad-calender", methods=["get"])
    def ad_calender(self, request, *args, **kwargs):
        calender = []
        if Calender.objects.filter(ad=kwargs["pk"], hide=False).exists():
            calender = Calender.objects.filter(ad=kwargs["pk"]).first()
            calender = self.get_serializer(calender).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=calender,
                status_code=status.HTTP_200_OK,
                message="Ad calender",
            ),
        )

    @action(detail=True, url_path="set-calender-availability", methods=["post"])
    def set_calender_availability(self, request, *args, **kwargs):
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
                    message="Calender updated",
                ),
            )
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=[],
                status_code=status.HTTP_200_OK,
                message="Doest not exists",
            ),
        )
