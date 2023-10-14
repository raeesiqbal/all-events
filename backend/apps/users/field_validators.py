# imports
from django.core.validators import RegexValidator
from rest_framework import serializers


class CustomPasswordValidator:
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$"
    message = (
        "Password must be at least 6 characters longRAEES"
        "contain at least one digit, one lowercase letter, and one uppercase letterRAEES"
        "Spaces are not allowed"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"password": e.message})


class CustomPhoneValidator:
    regex = r"^\+?\d$"
    message = (
        "Phone number must be between 8 and 15 characters longRAEES"
        "only contain digits and the '+' sign"
    )

    def __call__(self, value):
        if value == "":
            return
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"phone": e.detail[0]})


class CustomNameValidator:
    regex = r"^[a-zA-Z-]+$"
    message = (
        "First name must be between 2 and 20 characters long"
        "only contain letters, spaces, and hyphens"
        "It should not have two consecutive spaces or hyphens"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"phone": e.detail[0]})
        if (
            "--" in value
            or "  " in value
            or value.startswith(" ")
            or value.endswith(" ")
        ):
            raise serializers.ValidationError(self.message)
