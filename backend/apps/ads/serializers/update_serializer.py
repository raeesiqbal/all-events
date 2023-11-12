# imports
from rest_framework import serializers
from apps.utils.serializers.base import BaseSerializer
from apps.ads.mixins import SubscriptionTypeValidationMixin

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


class AdUpdateSerializer(SubscriptionTypeValidationMixin, BaseSerializer):
    faqs = serializers.ListField(child=FaqsChildCreateSerializer())
    ad_faq_ad = serializers.ListField(child=AdFAQChildCreateSerializer())
    media_urls = serializers.JSONField(default=dict)

    class Meta:
        model = Ad
        fields = [
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
            "media_urls",
            "name",
            "description",
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
