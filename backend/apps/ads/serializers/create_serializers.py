from apps.ads.models import Ad, Category, Country, Gallery, SubCategory, FAQ
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class FaqsChildCreateSerializer(BaseSerializer):
    class Meta:
        model = FAQ
        fields = ["sub_category", "question", "answer_input", "answer_checkbox", "type"]


class AdCreateSerializer(BaseSerializer):
    faqs = serializers.ListField(child=FaqsChildCreateSerializer())
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
        fields = ["url","media_type"]
