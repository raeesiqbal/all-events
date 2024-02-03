# imports
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers

# models
from apps.ads.models import (
    Ad,
    Category,
    Country,
    Gallery,
    SubCategory,
    FAQ,
    AdFAQ,
)

# validators
from apps.ads.mixins import SubscriptionTypeValidationMixin
from apps.ads.field_validatory import (
    CustomNameValidator,
    CustomDescriptionValidator,
    CustomContactPersonValidator,
    CustomWebsiteValidator,
    CustomCityValidator,
    CustomStreetValidator,
    CustomAddressValidator,
)


class FaqsChildCreateSerializer(BaseSerializer):
    question = serializers.CharField(
        max_length=150,
        min_length=1,
    )
    answer = serializers.CharField(
        max_length=500,
        min_length=1,
    )

    class Meta:
        model = FAQ
        fields = [
            "question",
            "answer",
        ]


class AdFAQChildCreateSerializer(BaseSerializer):
    answer = serializers.CharField(
        max_length=500,
        min_length=1,
    )

    class Meta:
        model = AdFAQ
        fields = [
            "site_question",
            "answer",
        ]


class UploadMediaSerializer(serializers.Serializer):
    file = serializers.ListField(child=serializers.FileField(allow_empty_file=False))


class GetUploadPresignedUrlSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    content_type = serializers.CharField(required=True)


class AdCreateSerializer(SubscriptionTypeValidationMixin, BaseSerializer):
    faqs = serializers.ListField(
        child=FaqsChildCreateSerializer(),
        required=False,
    )
    ad_faq_ad = serializers.ListField(
        child=AdFAQChildCreateSerializer(),
        required=False,
    )

    name = serializers.CharField(
        max_length=60,
        min_length=2,
        validators=[CustomNameValidator()],
    )
    description = serializers.CharField(
        max_length=6666,
        min_length=5,
        validators=[CustomDescriptionValidator()],
    )
    number = serializers.CharField(
        max_length=40,
        min_length=2,
        validators=[CustomContactPersonValidator()],
    )
    website = serializers.CharField(
        allow_blank=True,
        required=False,
        validators=[CustomWebsiteValidator()],
    )
    city = serializers.CharField(
        max_length=25,
        min_length=3,
        validators=[CustomCityValidator()],
    )
    street = serializers.CharField(
        max_length=27,
        min_length=3,
        validators=[CustomStreetValidator()],
    )
    full_address = serializers.CharField(
        max_length=80,
        min_length=5,
        validators=[CustomAddressValidator()],
    )

    facebook = serializers.CharField(
        allow_blank=True,
        required=False,
        validators=[CustomWebsiteValidator()],
    )
    instagram = serializers.CharField(
        allow_blank=True,
        required=False,
        validators=[CustomWebsiteValidator()],
    )
    youtube = serializers.CharField(
        allow_blank=True,
        required=False,
        validators=[CustomWebsiteValidator()],
    )
    tiktok = serializers.CharField(
        allow_blank=True,
        required=False,
        validators=[CustomWebsiteValidator()],
    )
    others = serializers.CharField(
        allow_blank=True,
        required=False,
        validators=[CustomWebsiteValidator()],
    )

    class Meta:
        model = Ad
        fields = [
            "name",
            "sub_category",
            "related_sub_categories",
            "activation_countries",
            "website",
            "country",
            "city",
            "street",
            "number",
            "full_address",
            "facebook",
            "instagram",
            "youtube",
            "tiktok",
            "twitter",
            "others",
            "offered_services",
            "site_services",
            "ad_faq_ad",
            "faqs",
            "description",
        ]


class SubCategoryCreateSerializer(BaseSerializer):
    class Meta:
        model = SubCategory
        fields = "__all__"


class CategoryCreateSerializer(BaseSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CountryCreateSerializer(BaseSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class UserImageSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    content_type = serializers.CharField(required=True)


class URLListSerializer(serializers.Serializer):
    urls = serializers.ListField(child=serializers.CharField())


class DeleteUrlSerializer(serializers.Serializer):
    url = serializers.CharField(required=True, max_length=1000)


class FaqsCreateSerializer(BaseSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"


class DeleteUrlOnUpdateSerializer(serializers.Serializer):
    url = serializers.CharField(required=True, max_length=1000)
    media_type = serializers.CharField(required=True, max_length=1000)

    class Meta:
        model = Gallery
        fields = ["url", "media_type"]


class SearchStringSerializer(serializers.Serializer):
    search_string = serializers.CharField(required=True, max_length=1000)

    class Meta:
        model = Gallery
        fields = ["search_string"]
