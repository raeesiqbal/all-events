# imports
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers

# models
from apps.clients.models import Client
from apps.users.models import User

# fields validators
from apps.users.field_validators import (
    CustomPasswordValidator,
    CustomPhoneValidator,
    CustomFirstNameValidator,
    CustomLastNameValidator,
)


class ClientUserChildSerializer(BaseSerializer):
    def to_internal_value(self, data):
        if "first_name" in data:
            data["first_name"] = data["first_name"].capitalize()
        if "last_name" in data:
            data["last_name"] = data["last_name"].capitalize()

        if "email" in data:
            data["email"] = data["email"].lower()
        return super().to_internal_value(data)

    phone = serializers.CharField(
        max_length=15,
        min_length=8,
        allow_blank=True,
        required=False,
        validators=[CustomPhoneValidator()],
    )
    password = serializers.CharField(
        max_length=128,
        min_length=6,
        write_only=True,
        validators=[CustomPasswordValidator()],
    )
    first_name = serializers.CharField(
        max_length=20,
        min_length=2,
        validators=[CustomFirstNameValidator()],
    )
    last_name = serializers.CharField(
        max_length=20,
        min_length=2,
        validators=[CustomLastNameValidator()],
    )

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone",
            "password",
            "newsletter",
            "terms_acceptance",
        ]


class ClientCreateSerializer(BaseSerializer):
    user = ClientUserChildSerializer()

    class Meta:
        model = Client
        fields = ["user"]
