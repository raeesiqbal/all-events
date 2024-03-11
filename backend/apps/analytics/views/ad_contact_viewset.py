# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.response import Response
from rest_framework import status
from django.template.loader import render_to_string
from datetime import date
from apps.utils.tasks import send_email_to_user

# permissions
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsVendorUser, IsVerified

# constants
from apps.users.constants import USER_ROLE_TYPES


# models
from apps.analytics.models import ContactRequest

# serializers
from apps.analytics.serializers.get_serializer import (
    AdContactGetSerializer,
)


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
        "default": [IsAuthenticated, IsVerified, IsVendorUser],
        "list": [IsAuthenticated, IsVerified, IsVendorUser],
        "destroy": [IsAuthenticated, IsVerified, IsVendorUser],
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
        message = ContactRequest.objects.create(**serializer.validated_data)
        context = {
            "message": message,
            "year": date.today().year,
        }
        send_email_to_user.delay(
            f"You have received a contact request",
            render_to_string("emails/contact-request/contact-request.html", context),
            render_to_string("emails/contact-request/contact-request.txt", context),
            message.ad.company.user.email,
        )
        return Response(
            status=status.HTTP_201_CREATED,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_201_CREATED,
                message="Vendor has been informed about your request. He will contact you soon.",
            ),
        )
