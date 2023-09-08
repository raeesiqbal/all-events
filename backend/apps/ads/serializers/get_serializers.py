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
)
from apps.analytics.models import FavouriteAd
from apps.companies.models import Company
from apps.users.constants import USER_ROLE_TYPES
from apps.utils.serializers.base import BaseSerializer
from apps.analytics.models import FavouriteAd


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


class AdGetSerializer(BaseSerializer):
    sub_category = SubCategoryGetSerializer()
    related_sub_categories = SubCategoryGetSerializer()
    activation_countries = CountryGetSerializer(many=True)
    company = VendorChildSerializer()
    country = CountryGetSerializer()
    ad_media = GalleryChildSerializer(many=True)
    ad_faqs = FaqsGetSerializer(many=True)

    ad_save_count = serializers.SerializerMethodField("get_ad_saved_count")
    my_fav = serializers.SerializerMethodField("get_my_fav")

    def get_ad_saved_count(self, obj):
        return obj.ad_saved.all().count()

    def get_my_fav(self, obj):
        user = self.context["request"].user
        fav = False
        if user.role_type == USER_ROLE_TYPES["CLIENT"]:
            fav = FavouriteAd.objects.filter(user=user, ad=obj).exists()
        return fav

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

    class Meta:
        model = Ad
        fields = "__all__"

    def get_fav(self, obj):
        if self.context.get("user", None):
            user = self.context.get("user", None)
            fav = False
            if user.role_type == USER_ROLE_TYPES["CLIENT"]:
                fav = FavouriteAd.objects.filter(user=user, ad=obj).exists()
            return fav
        return None


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

    class Meta:
        model = Ad
        fields = "__all__"
