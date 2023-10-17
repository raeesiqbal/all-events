from rest_framework import serializers

class MediaUrlsValidationMixin:
    def validate_media_urls(self, value):
        if not value or not isinstance(value, dict):
            raise serializers.ValidationError("media_urls must be a non-empty dictionary")
        return value

class OfferedServicesValidationMixin:
    def validate_offered_services(self, value):
        if not value or not isinstance(value, list):
            raise serializers.ValidationError("offered_services must be a non-empty list")
        return value
