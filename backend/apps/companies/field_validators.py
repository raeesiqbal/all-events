# imports
from django.core.validators import RegexValidator
from rest_framework import serializers
import re


class CustomCompanyNameValidator:
    regex = r"^[a-zA-Z., $]+$"
    message = (
        "Company Name must be between 6 and 25 characters long"
        "only contain letters, spaces and , . & signs are allowed"
        "It should not have two consecutive spaces"
    )

    def __call__(self, value):
        value = re.sub(r"\s+", " ", value.strip())
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"name": e.detail[0]})


class CustomCityValidator:
    regex = r"^(?!.*--)[a-zA-Z -]+$"
    message = (
        "City must be between 3 and 25 characters long"
        "only contain letters, spaces, and hyphens"
        "It should not have two consecutive hyphens"
    )

    def __call__(self, value):
        value = re.sub(r"\s+", " ", value.strip())
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"city": e.detail[0]})


class CustomAddressValidator:
    regex = r"^[a-zA-Z\d,.\-/\s]+$"
    message = (
        "Address must be between 5 and 80 characters long"
        "only contain letters, digits, spaces, and . , - / signs"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"address": e.detail[0]})


class CustomPostalCodeValidator:
    regex = r"^\d+$"
    message = (
        "Postal Code must be between 5 and 7 characters long" "only digits are allowed"
    )

    def __call__(self, value):
        if value == "":
            return
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"postal_code": e.detail[0]})


class CustomFiscalCodeValidator:
    regex = r"^[a-zA-Z\d-]+$"
    message = (
        "Fiscal Code must be between 4 and 20 characters long"
        "only letters and digits are allowed"
    )

    def __call__(self, value):
        value = re.sub(r"\s+", " ", value.strip())
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"fiscal_code": e.detail[0]})


class CustomFirmNumberValidator:
    regex = r"^[a-zA-Z\d./]+$"
    message = (
        "Firm Numer must be between 4 and 20 characters long"
        "only letters, digits, / . are allowed"
    )

    def __call__(self, value):
        value = re.sub(r"\s+", " ", value.strip())
        if not any(c.isalpha() or c.isdigit() for c in value):
            raise serializers.ValidationError(self.message)
        value = re.sub(r"\s+", " ", value.strip())
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"firm_number": e.detail[0]})


class CustomBankNameValidator:
    regex = r"^[a-zA-Z0-9\s]*[a-zA-Z0-9][a-zA-Z0-9\s]*$"
    message = (
        "Bank Name must be between 1 and 30 characters long"
        "only letters and digits are allowed"
    )

    def __call__(self, value):
        if value == "":
            return
        value = re.sub(r"\s+", " ", value.strip())
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"bank_name": e.detail[0]})


class CustomBankIBANValidator:
    regex = r"^[a-zA-Z\d]+$"
    message = (
        "Bank IBN must be between 1 and 30 characters long"
        "only letters and digits are allowed"
    )

    def __call__(self, value):
        if value == "":
            return
        if not any(c.isalpha() or c.isdigit() for c in value):
            raise serializers.ValidationError(self.message)
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"bank_name": e.detail[0]})
