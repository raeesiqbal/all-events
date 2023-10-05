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
        "create": CalenderCreateSerializer,
        "vendor_calender_list": CalenderGetSerializer,
    }
    action_permissions = {
        "default": [],
        "create": [IsAuthenticated | IsVendorUser],
        "vendor_calender_list": [IsAuthenticated, IsVendorUser],
    }

    @action(detail=False, url_path="vendor-calender-list", methods=["get"])
    def vendor_calender_list(self, request, *args, **kwargs):
        calenders = []
        if Calender.objects.filter(company=request.user.user_company).exists():
            calenders = Calender.objects.filter(company=request.user.user_company)
            calenders = self.get_serializer(calenders, many=True).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=calenders,
                status_code=status.HTTP_200_OK,
                message="Vendor calender list",
            ),
        )
