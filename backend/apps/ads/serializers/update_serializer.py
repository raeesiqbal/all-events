from apps.ads.models import FAQ, Ad, Category, Country, SubCategory
from apps.ads.serializers.create_serializers import FaqsChildCreateSerializer
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class AdUpdateSerializer(BaseSerializer):
    faqs = serializers.ListField(child=FaqsChildCreateSerializer())
    media_urls = serializers.JSONField(default=dict)
    
    class Meta:
        model = Ad
        fields = ["sub_category",
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
            "description",]

class SubCategoryUpdateSerializer(BaseSerializer):
    
    
    class Meta:
        model = SubCategory
        fields = '__all__'


class CategoryUpdateSerializer(BaseSerializer):
    
    
    class Meta:
        model = Category
        fields = '__all__'

class CountryUpdateSerializer(BaseSerializer):
    
    
    class Meta:
        model = Country
        fields = '__all__'


class FaqsUpdateSerializer(BaseSerializer):
    
    
    class Meta:
        model = FAQ
        fields = '__all__'