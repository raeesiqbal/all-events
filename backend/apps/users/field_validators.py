# imports
from django.core.validators import RegexValidator
from rest_framework import serializers
import re


class CustomPasswordValidator:
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$"
    message = (
        "Password must be at least 6 characters long"
        "contain at least one digit, one lowercase letter, and one uppercase letter"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)

        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"password": e.message})


class CustomPhoneValidator:
    regex = r"^\+?[0-9]+$"
    message = (
        "Phone number must be between 8 and 15 characters long"
        "only contain digits and the '+' sign"
    )

    def __call__(self, value):
        if value == "":
            return
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())

        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"phone": e.detail[0]})


class CustomFirstNameValidator:
    regex = r"^(?!.*--)[a-zA-Z][a-zA-Z -]*[a-zA-Z]$"

    message = (
        "First name must be between 2 and 20 characters long"
        "only contain letters, spaces, and hyphens"
        "It should not have two consecutive spaces or hyphens"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"first_name": e.detail[0]})


class CustomLastNameValidator:
    regex = r"^(?!.*--)[a-zA-Z][a-zA-Z -]*[a-zA-Z]$"

    message = (
        "First name must be between 2 and 20 characters long"
        "only contain letters, spaces, and hyphens"
        "It should not have two consecutive spaces or hyphens"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"last_name": e.detail[0]})
