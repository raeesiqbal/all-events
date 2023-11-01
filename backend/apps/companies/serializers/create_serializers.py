# imports
from rest_framework import serializers

# field validators
from apps.users.field_validators import (
    CustomPasswordValidator,
    CustomPhoneValidator,
    CustomNameValidator,
)
from apps.companies.field_validators import (
    CustomCompanyNameValidator,
    CustomCityValidator,
    CustomAddressValidator,
    CustomPostalCodeValidator,
    CustomFiscalCodeValidator,
    CustomFirmNumberValidator,
    CustomBankNameValidator,
    CustomBankIBANValidator,
)

# models
from apps.users.models import User
from apps.companies.models import Company

# serializers
from apps.utils.serializers.base import BaseSerializer


class UserChildSerializer(BaseSerializer):
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
        validators=[CustomNameValidator()],
    )
    last_name = serializers.CharField(
        max_length=20,
        min_length=2,
        validators=[CustomNameValidator()],
    )

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
    name = serializers.CharField(
        max_length=25,
        min_length=5,
        validators=[CustomCompanyNameValidator()],
    )
    city = serializers.CharField(
        max_length=25,
        min_length=3,
        validators=[CustomCityValidator()],
    )
    address = serializers.CharField(
        max_length=80,
        min_length=5,
        validators=[CustomAddressValidator()],
    )
    postal_code = serializers.IntegerField(
        required=False,
        validators=[CustomPostalCodeValidator()],
    )
    fiscal_code = serializers.CharField(
        max_length=20,
        min_length=4,
        validators=[CustomFiscalCodeValidator()],
    )
    firm_number = serializers.CharField(
        max_length=20,
        min_length=4,
        validators=[CustomFirmNumberValidator()],
    )
    bank_name = serializers.CharField(
        max_length=30,
        min_length=1,
        allow_blank=True,
        validators=[CustomBankNameValidator()],
    )
    bank_iban = serializers.CharField(
        max_length=30,
        min_length=1,
        allow_blank=True,
        validators=[CustomBankIBANValidator()],
    )

    class Meta:
        model = Company
        fields = "__all__"
