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
    SiteQuestion,
    SiteFAQ,
)
from apps.analytics.models import AdReview, Calender
from django.db.models import Avg
from apps.analytics.models import FavouriteAd
from apps.companies.models import Company
from apps.users.constants import USER_ROLE_TYPES
from apps.utils.serializers.base import BaseSerializer
from apps.analytics.models import FavouriteAd
from django.db.models import Q


class SiteQuestionChildGetSerializer(BaseSerializer):
    class Meta:
        model = SiteQuestion
        fields = ["question"]


class CountryGetSerializer(BaseSerializer):
    class Meta:
        model = Country
        fields = "__all__"


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


class VenueCountryGetSerializer(BaseSerializer):
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
    fav = serializers.SerializerMethodField()

    def get_ad_saved_count(self, obj):
        return obj.ad_saved.all().count()

    def get_fav(self, obj):
        return None
        request = self.context["request"]
        if request.user.is_authenticated:
            user = request.user
            if user.role_type == USER_ROLE_TYPES["CLIENT"]:
                fav = FavouriteAd.objects.filter(user=user, ad=obj).exists()
                return fav
            else:
                return None
        else:
            return None

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
    fav = serializers.SerializerMethodField()
    ad_faq_ad = AdFaqsGetSerializer(many=True)
    total_reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    calendar_display = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = "__all__"

    def get_fav(self, obj):
        request = self.context["request"]
        if request.user.is_authenticated:
            user = request.user
            if user.role_type == USER_ROLE_TYPES["CLIENT"]:
                fav = FavouriteAd.objects.filter(user=user, ad=obj).exists()
                return fav
            else:
                return None
        else:
            return None

    def get_total_reviews(self, obj):
        return AdReview.objects.filter(ad=obj).count()

    def get_average_rating(self, obj):
        avg_rating = AdReview.objects.filter(ad=obj).aggregate(Avg("rating"))
        return avg_rating["rating__avg"]

    def get_calendar_display(self, obj):
        if Calender.objects.filter(ad=obj, hide=True).exists():
            return False
        else:
            return True


class SuggestionGetSerializer(BaseSerializer):
    name = serializers.CharField(max_length=100)
    type = serializers.CharField(max_length=100)

    class Meta:
        model = Ad
        fields = ["name", "type"]


class PremiumAdGetSerializer(BaseSerializer):
    sub_category = SubCategoryGetSerializer()
    related_sub_categories = SubCategoryGetSerializer()
    activation_countries = CountryGetSerializer(many=True)
    company = VendorChildSerializer()
    country = CountryGetSerializer()
    ad_media = GalleryChildSerializer(many=True)
    ad_faqs = FaqsGetSerializer(many=True)
    fav = serializers.SerializerMethodField()

    def get_fav(self, obj):
        request = self.context["request"]
        if request.user.is_authenticated:
            user = request.user
            if user.role_type == USER_ROLE_TYPES["CLIENT"]:
                fav = FavouriteAd.objects.filter(user=user, ad=obj).exists()
                return fav
            else:
                return None
        else:
            return None

    class Meta:
        model = Ad
        fields = "__all__"


class SubCategoryChildGetSerializer(BaseSerializer):
    class Meta:
        model = SubCategory
        fields = "__all__"


class SiteQuestionSerializer(BaseSerializer):
    class Meta:
        model = SiteQuestion
        fields = ["question", "suggestion"]


class SiteFaqSerializer(BaseSerializer):
    site_faq_questions = SiteQuestionSerializer(many=True, read_only=True)
    section = serializers.SerializerMethodField()

    class Meta:
        model = SiteFAQ
        fields = ["section", "site_faq_questions"]

    def get_section(self, obj):
        return obj.section.name


class ServiceFilterSerializer(BaseSerializer):
    class Meta:
        model = Service
        fields = ["service"]


class SubCategoryFilterSerializer(BaseSerializer):
    site_faq_sub_category = SiteFaqSerializer(many=True, read_only=True)
    service_sub_category = ServiceFilterSerializer(many=True, read_only=True)

    class Meta:
        model = SubCategory
        fields = ["name", "site_faq_sub_category", "service_sub_category"]


class CategoryKeywordSerializer(BaseSerializer):
    sub_categories = SubCategoryChildGetSerializer(many=True)

    class Meta:
        model = Category
        fields = "__all__"


class SubCategoryKeywordSerializer(BaseSerializer):
    category = CategoryCreateSerializer()

    class Meta:
        model = SubCategory
        fields = "__all__"


class AdDashboardSerializer(BaseSerializer):
    ad_image = serializers.SerializerMethodField("get_ad_image")
    sub_category = serializers.SerializerMethodField()

    def get_ad_image(self, obj):
        gallery = Gallery.objects.filter(ad=obj).first()

        return (
            gallery.media_urls.get("images")[0]
            if gallery.media_urls.get("images") and gallery.media_urls.get("images")[0]
            else None
        )

    def get_sub_category(self, obj):
        return obj.sub_category.name

    class Meta:
        model = Ad
        fields = [
            "name",
            "ad_image",
            "sub_category",
            "status",
        ]
