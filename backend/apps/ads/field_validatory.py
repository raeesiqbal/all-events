# imports
from django.core.validators import RegexValidator
from rest_framework import serializers
import re


class CustomNameValidator:
    regex = r"^(?!\s*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]*\s*$).{2,60}$"

    message = (
        "Commercial name should be 2 to 60 characters long and cannot be entirely signs"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"name": e.detail[0]})


class CustomDescriptionValidator:
    regex = r"^(?!\s*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]*$)[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/? ]{5,6666}$"

    message = "Cannot be entirely signs"

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"description": e.detail[0]})


class CustomContactPersonValidator:
    regex = r"^(?=[a-zA-Z\s-]{2,40}$)(?!^[ -]*$)[a-zA-Z-]+$"

    message = "Only - sign is allowed and cannot be entirely signs"

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"number": e.detail[0]})


class CustomWebsiteValidator:
    regex = r"^(?:(?:https?|ftp):\/\/|www\.)?[^\s\/$.?#].[^\s]*$"

    message = "Must be a valid website url"

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"website": e.detail[0]})


class CustomCityValidator:
    regex = r"^(?=[a-zA-Z\s-]{3,25}$)(?!^[ -]*$)[a-zA-Z-]+$"
    message = (
        "Only - sign is allowed and cannot be entirely signs. Digits are not allowed"
    )

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"city": e.detail[0]})


class CustomStreetValidator:
    regex = r"^(?!^[ ,./-]*$)[a-zA-Z0-9 ,./-]{3,27}$"
    message = "- . , / signs and letters, digits, spaces are allowed. Cann't be entirely sings."

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"street": e.detail[0]})


class CustomAddressValidator:
    regex = r"^(?!^[ ,./-]*$)[a-zA-Z0-9 ,./-]{5,80}$"
    message = "- . , / signs and letters, digits, spaces are allowed. Cann't be entirely sings."

    def __call__(self, value):
        regex_validator = RegexValidator(regex=self.regex, message=self.message)
        value = re.sub(r"\s+", " ", value.strip())
        try:
            regex_validator(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"address": e.detail[0]})
