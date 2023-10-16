from rest_framework import serializers
from apps.companies.models import Company


from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer


class UserChildSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone",
            "password",
            "role_type",
            "newsletter",
            "terms_acceptance",
            "image",
        ]


class VendorCreateSerializer(BaseSerializer):
    user = UserChildSerializer()

    class Meta:
        model = Company
        fields = "__all__"
