from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers
from apps.ads.models import (
    Ad,
    Category,
    Country,
    Gallery,
    SubCategory,
    FAQ,
    AdFAQ,
)


class FaqsChildCreateSerializer(BaseSerializer):
    class Meta:
        model = FAQ
        fields = [
            "question",
            "answer",
        ]


class AdFAQChildCreateSerializer(BaseSerializer):
    class Meta:
        model = AdFAQ
        fields = [
            "site_question",
            "answer",
        ]


class AdCreateSerializer(BaseSerializer):
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
            "ad_faq_ad",
            "faqs",
            "media_urls",
            "name",
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


class GetUploadPresignedUrlSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    content_type = serializers.CharField(required=True)


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
