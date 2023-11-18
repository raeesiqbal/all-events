# imports
from rest_framework import serializers
from apps.utils.serializers.base import BaseSerializer

# models
from apps.clients.models import Client
from apps.users.models import User

# fields validators
from apps.users.field_validators import (
    CustomPhoneValidator,
    CustomFirstNameValidator,
    CustomLastNameValidator,
)


class ClientUserUpdateChildSerializer(BaseSerializer):
    def to_internal_value(self, data):
        if "first_name" in data:
            data["first_name"] = data["first_name"].capitalize()
        if "last_name" in data:
            data["last_name"] = data["last_name"].capitalize()

    phone = serializers.CharField(
        max_length=15,
        min_length=8,
        allow_blank=True,
        required=False,
        validators=[CustomPhoneValidator()],
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
            "first_name",
            "last_name",
            "phone",
        ]


class ClientUpdateSerializer(BaseSerializer):
    user = ClientUserUpdateChildSerializer()

    class Meta:
        model = Client
        fields = ["user"]
