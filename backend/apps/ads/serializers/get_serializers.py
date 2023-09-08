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
from django.db.models import Q


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


class ServiceGetUniqueSerializer(BaseSerializer):
    service = serializers.SerializerMethodField()

    def get_service(self, obj):
        all_services = obj.service
        offered_services = self.context.get("all_services", None)
        unique_services = []
        for item in all_services:
            if item not in offered_services and item not in unique_services:
                unique_services.append(item)

        return unique_services

    class Meta:
        model = Service
        fields = [
            "service",
        ]

    def to_representation(self, instance):
        context = self.context  # Get the context passed to the serializer
        # You can access context data and modify representation here
        representation = super().to_representation(instance)
        # Modify or add data to the representation as needed using context
        return representation


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

    site_services_list = serializers.SerializerMethodField()

    def get_site_services_list(self, obj):
        services = Service.objects.filter(sub_category__id=obj.sub_category.id)
        # object_services = obj.offered_services
        # context_data = {"all_services": object_services}
        # child_serializer = ServiceGetUniqueSerializer(
        #     services, context=context_data, many=True
        # )
        child_serializer = ServiceGetSerializer(services, many=True)
        return child_serializer.data

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
