# imports
from rest_framework import serializers
from apps.utils.serializers.base import BaseSerializer

# models
from apps.ads.models import (
    FAQ,
    Ad,
    Category,
    Country,
    SubCategory,
)

# serializers
from apps.ads.serializers.create_serializers import (
    FaqsChildCreateSerializer,
    AdFAQChildCreateSerializer,
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


class AdUpdateSerializer(SubscriptionTypeValidationMixin, BaseSerializer):
    faqs = serializers.ListField(child=FaqsChildCreateSerializer())
    ad_faq_ad = serializers.ListField(child=AdFAQChildCreateSerializer())
    media_urls = serializers.JSONField(default=dict)
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
    delete_urls = serializers.ListField(
        child=serializers.CharField(),  # Use CharField as the child
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Ad
        fields = [
            "name",
            "sub_category",
            "related_sub_categories",
            "activation_countries",
            "description",
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
            "media_urls",
            "delete_urls",
        ]


class SubCategoryUpdateSerializer(BaseSerializer):
    class Meta:
        model = SubCategory
        fields = "__all__"


class CategoryUpdateSerializer(BaseSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CountryUpdateSerializer(BaseSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class FaqsUpdateSerializer(BaseSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"
