# imports
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers

# models
from apps.companies.models import Company
from apps.users.models import User

# field validators
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
from apps.users.field_validators import (
    CustomPhoneValidator,
    CustomFirstNameValidator,
    CustomLastNameValidator,
)


class VendorUpdateSerializer(BaseSerializer):
    name = serializers.CharField(
        max_length=25,
        min_length=5,
        validators=[CustomCompanyNameValidator()],
    )
    postal_code = serializers.CharField(
        max_length=7,
        min_length=5,
        allow_blank=True,
        required=False,
        validators=[CustomPostalCodeValidator()],
    )
    fiscal_code = serializers.CharField(
        max_length=20,
        min_length=4,
        validators=[CustomFiscalCodeValidator()],
    )
    address = serializers.CharField(
        max_length=80,
        min_length=5,
        validators=[CustomAddressValidator()],
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
        required=False,
        validators=[CustomBankNameValidator()],
    )
    bank_iban = serializers.CharField(
        max_length=30,
        min_length=1,
        allow_blank=True,
        required=False,
        validators=[CustomBankIBANValidator()],
    )
    city = serializers.CharField(
        max_length=25,
        min_length=3,
        validators=[CustomCityValidator()],
    )

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
    phone = serializers.CharField(
        max_length=15,
        min_length=8,
        allow_blank=True,
        required=False,
        validators=[CustomPhoneValidator()],
    )

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone",
        ]


class UserDeleteSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = ["password", "delete_reason"]
