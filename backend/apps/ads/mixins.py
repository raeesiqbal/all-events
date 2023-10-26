from rest_framework import serializers
from apps.subscriptions.models import Subscription


class SubscriptionTypeValidationMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = self.context.get("request").user
        self.subscription = Subscription.objects.filter(
            company=self.user.user_company
        ).first()
        self.subscription_type = self.subscription.type

    def validate_media_urls(self, value):
        allowed_photos = self.subscription_type.allowed_ad_photos
        allowed_videos = self.subscription_type.allowed_ad_videos
        is_pdf_upload_allowed = self.subscription_type.pdf_upload

        photos = len(value.get("images", []))
        videos = len(value.get("video", []))
        pdfs = len(value.get("pdf", []))

        errors = []

        if photos > allowed_photos:
            errors.append("Uploaded images count is greater than allowed images")

        if videos > allowed_videos:
            errors.append("Uploaded videos count is greater than allowed videos")

        if pdfs > 0:
            if not is_pdf_upload_allowed:
                errors.append("Pdf upload is not allowed")
            elif pdfs > 5:
                errors.append("Uploaded Pdf's count is greate than allowed pdf's")
        if errors:
            raise serializers.ValidationError(errors)
        return value

    def validate_offered_services(self, value):
        if value:
            if value and self.subscription_type.offered_services:
                return value
            else:
                raise serializers.ValidationError("Offered services are not allowed")

    def validate_faqs(self, value):
        if value:
            if self.subscription_type.faq:
                return value
            else:
                raise serializers.ValidationError("FAQ's are not allowed")
