from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.analytics.serializers.get_serializer import (
    AdContactGetSerializer,
)
from apps.users.constants import USER_ROLE_TYPES
from apps.users.permissions import IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo


from apps.analytics.models import ContactRequest


class ContactViewSet(BaseViewset):
    """
    API endpoints that manages Ad Contact Requests
    """

    queryset = ContactRequest.objects.all()

    action_serializers = {
        "default": AdContactGetSerializer,
        "list": AdContactGetSerializer,
        "create": AdContactGetSerializer,
    }

    action_permissions = {
        "default": [IsAuthenticated, IsVendorUser],
        "list": [IsAuthenticated, IsVendorUser],
        "destroy": [IsAuthenticated, IsVendorUser],
        "create": [],
    }

    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: ContactRequest.objects.filter(
            ad__company__user_id=self.request.user.id
        )
    }

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ContactRequest.objects.create(**serializer.validated_data)
        return Response(
            status=status.HTTP_201_CREATED,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_201_CREATED,
                message="Contact request has been created successfully",
            ),
        )
