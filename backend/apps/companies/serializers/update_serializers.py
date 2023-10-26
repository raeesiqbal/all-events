from rest_framework import serializers
from apps.companies.models import Company


from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer


class VendorUpdateSerializer(BaseSerializer):
    class Meta:
        model = Company
        fields = [
            "name",
            "postal_code",
            "fiscal_code",
            "address",
            "firm_number",
            "bank_name",
            "bank_iban",
            "country",
            "city",
        ]


class UserUpdateSerializer(BaseSerializer):
    def to_internal_value(self, data):
        if "first_name" in data:
            data["first_name"] = data["first_name"].capitalize()
        if "last_name" in data:
            data["last_name"] = data["last_name"].capitalize()

        return super().to_internal_value(data)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone"]


class UserDeleteSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = ["password", "delete_reason"]
