# imports
from django.core.validators import RegexValidator
from rest_framework import serializers


class CustomCompanyNameValidator:
    regex = r"^[a-zA-Z.,$]+$"
    message = (
        "Company Name must be between 6 and 25 characters long"
        "only contain letters, spaces and , . & signs are allowed"
        "It should not have two consecutive spaces"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"name": e.detail[0]})
        if "  " in value or value.startswith(" ") or value.endswith(" "):
            raise serializers.ValidationError(self.message)

        if len([c for c in value if c.isalpha()]) < 2:
            raise serializers.ValidationError(self.message)


class CustomCityValidator:
    regex = r"^[a-zA-Z-]+$"
    message = (
        "City must be between 3 and 25 characters long"
        "only contain letters, spaces, and hyphens"
        "It should not have two consecutive spaces or hyphens"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"city": e.detail[0]})
        if (
            "--" in value
            or "  " in value
            or value.startswith(" ")
            or value.endswith(" ")
        ):
            raise serializers.ValidationError(self.message)


class CustomAddressValidator:
    regex = r"^[a-zA-Z\d,.\-/]+$"
    message = (
        "Address must be between 5 and 80 characters long"
        "only contain letters, digits, spaces, and . , - / signs"
        "It should not have two consecutive spaces"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"address": e.detail[0]})
        if "  " in value or value.startswith(" ") or value.endswith(" "):
            raise serializers.ValidationError(self.message)


class CustomPostalCodeValidator:
    regex = r"^\d+$"
    message = (
        "Postal Code must be between 5 and 7 characters long"
        "only contain digits are allowed"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"postal_code": e.detail[0]})
        if not (5 <= len(str(value)) <= 7):
            raise serializers.ValidationError(self.message)


class CustomFiscalCodeValidator:
    regex = r"^[a-zA-Z\d-]+$"
    message = (
        "Fiscal Code must be between 4 and 20 characters long"
        "only contain letters, digits are allowed"
        "It should not have two consecutive spaces"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"fiscal_code": e.detail[0]})
        if "  " in value or value.startswith(" ") or value.endswith(" "):
            raise serializers.ValidationError(self.message)


class CustomFirmNumberValidator:
    regex = r"^[a-zA-Z\d./]+$"
    message = (
        "Firm Numer must be between 4 and 20 characters long"
        "only contain letters, digits, / . are allowed"
        "It should not have two consecutive spaces"
        "only signs are not allowed"
    )

    def __call__(self, value):
        if not any(c.isalpha() or c.isdigit() for c in value):
            raise serializers.ValidationError(self.message)
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"firm_number": e.detail[0]})
        if "  " in value or value.startswith(" ") or value.endswith(" "):
            raise serializers.ValidationError(self.message)


class CustomBankNameValidator:
    regex = r"^[a-zA-Z\d]+$"
    message = (
        "Bank Name must be between 1 and 30 characters long"
        "only letters and digits are allowed"
        "It should not have two consecutive spaces"
    )

    def __call__(self, value):
        if not any(c.isalpha() or c.isdigit() for c in value):
            raise serializers.ValidationError(self.message)
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"bank_name": e.detail[0]})
        if "  " in value or value.startswith(" ") or value.endswith(" "):
            raise serializers.ValidationError(self.message)


class CustomBankIBANValidator:
    regex = r"^[a-zA-Z\d]+$"
    message = (
        "Bank IBN must be between 1 and 30 characters long"
        "only letters and digits are allowed"
    )

    def __call__(self, value):
        if not any(c.isalpha() or c.isdigit() for c in value):
            raise serializers.ValidationError(self.message)
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"bank_name": e.detail[0]})
        if " " in value or value.startswith(" ") or value.endswith(" "):
            raise serializers.ValidationError(self.message)
