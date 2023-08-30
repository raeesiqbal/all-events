from apps.ads.models import FAQ, Ad, Category, Country, Gallery, SubCategory
from apps.ads.serializers.create_serializers import CategoryCreateSerializer
from rest_framework import serializers
from apps.ads.models import (
    FAQ,
    Ad,
    Category,
    Country,
    Gallery,
    RelatedSubCategory,
    SubCategory,
    Service,
    SiteQuestion,
    SiteFAQ,
    AdFAQ,
)

from apps.companies.models import Company
from apps.utils.serializers.base import BaseSerializer


class SiteQuestionChildGetSerializer(BaseSerializer):
    class Meta:
        model = SiteQuestion
        fields = ["question"]


class SiteQuestionChildSerializer(BaseSerializer):
    class Meta:
        model = SiteQuestion
        fields = ["question", "suggestion"]


class SiteQuestionGetSerializer(BaseSerializer):
    site_faq_questions = SiteQuestionChildSerializer(many=True, read_only=True)
    section = serializers.SerializerMethodField()

    def get_section(self, obj):
        return obj.section.name

    class Meta:
        model = SiteFAQ
        fields = ["section", "site_faq_questions"]


class ServiceGetSerializer(BaseSerializer):
    class Meta:
        model = Service
        fields = [
            "service",
        ]


class SubCategoryGetSerializer(BaseSerializer):
    category = CategoryCreateSerializer()


class CategoryGetSerializer(BaseSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CategoryGetSerializer(BaseSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class SubCategoryGetSerializer(BaseSerializer):
    category = CategoryGetSerializer()

    class Meta:
        model = SubCategory
        fields = "__all__"


class CountryGetSerializer(BaseSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class FaqsGetSerializer(BaseSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"


class AdFaqsRetrieveSerializer(BaseSerializer):
    site_question = SiteQuestionChildSerializer()

    class Meta:
        model = AdFAQ
        fields = [
            "site_question",
            "answer",
        ]


class AdFaqsGetSerializer(BaseSerializer):
    site_question = SiteQuestionChildGetSerializer()

    class Meta:
        model = AdFAQ
        fields = [
            "site_question",
            "answer",
        ]


class VendorChildSerializer(BaseSerializer):
    class Meta:
        model = Company
        fields = [
            "name",
            "postal_code",
            "fiscal_code",
            "address",
            "firm_number",
            "bank_name",
            "bank_iban",
        ]


class GalleryChildSerializer(BaseSerializer):
    class Meta:
        model = Gallery
        fields = ["media_urls"]


class AdRetriveSerializer(BaseSerializer):
    sub_category = SubCategoryGetSerializer()
    related_sub_categories = SubCategoryGetSerializer()
    activation_countries = CountryGetSerializer(many=True)
    company = VendorChildSerializer()
    country = CountryGetSerializer()
    ad_media = GalleryChildSerializer(many=True)
    ad_faqs = FaqsGetSerializer(many=True)
    ad_faq_ad = AdFaqsRetrieveSerializer(many=True)

    ad_save_count = serializers.SerializerMethodField("get_ad_saved_count")

    def get_ad_saved_count(self, obj):
        return obj.ad_saved.all().count()

    class Meta:
        model = Ad
        fields = "__all__"


class AdGetSerializer(BaseSerializer):
    sub_category = SubCategoryGetSerializer()
    related_sub_categories = SubCategoryGetSerializer()
    activation_countries = CountryGetSerializer(many=True)
    company = VendorChildSerializer()
    country = CountryGetSerializer()
    ad_media = GalleryChildSerializer(many=True)
    ad_faqs = FaqsGetSerializer(many=True)

    ad_save_count = serializers.SerializerMethodField("get_ad_saved_count")

    def get_ad_saved_count(self, obj):
        return obj.ad_saved.all().count()

    class Meta:
        model = Ad
        fields = "__all__"


class RelatedSubCategory2GetSerializer(BaseSerializer):
    sub_category_2 = SubCategoryGetSerializer()

    class Meta:
        model = RelatedSubCategory
        fields = ["sub_category_2"]


class RelatedSubCategoryGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = fields = "__all__"


class AdPublicGetSerializer(BaseSerializer):
    sub_category = SubCategoryGetSerializer()
    related_sub_categories = SubCategoryGetSerializer()
    activation_countries = CountryGetSerializer(many=True)
    company = VendorChildSerializer()
    country = CountryGetSerializer()
    ad_media = GalleryChildSerializer(many=True)
    ad_faqs = FaqsGetSerializer(many=True)
    ad_faq_ad = AdFaqsGetSerializer(many=True)

    class Meta:
        model = Ad
        fields = "__all__"


class SuggestionGetSerializer(BaseSerializer):
    name = serializers.CharField(max_length=100)
    type = serializers.CharField(max_length=100)

    class Meta:
        model = Ad
        fields = ["name", "type"]
