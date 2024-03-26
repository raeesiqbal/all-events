# Imports
from django.contrib import admin
from apps.utils.services.s3_service import S3Service
from django.urls import reverse
from django.utils.html import format_html

# Forms
from .forms import CountryAdminForm

# Models

from .models import (
    FAQ,
    Ad,
    Category,
    SubCategory,
    Country,
    RelatedSubCategory,
    ActivationSubCategory,
    Gallery,
    Service,
    SiteFAQ,
    SiteQuestion,
    SectionName,
    AdFAQ,
)


class SectionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )
    search_fields = [
        "id",
        "name",
    ]


class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 1


class FAQInline(admin.TabularInline):
    model = FAQ
    extra = 1


class AdAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_company_email",
        "name",
        "get_category",
        "sub_category",
        "status",
    )

    def get_category(self, obj):
        category_url = reverse(
            "admin:%s_%s_change"
            % (
                obj.sub_category.category._meta.app_label,
                obj.sub_category.category._meta.model_name,
            ),
            args=[obj.sub_category.category.pk],
        )
        return format_html(
            '<a href="{}">{}</a>', category_url, obj.sub_category.category
        )

    def get_company_email(self, obj):
        company_admin_url = reverse(
            "admin:%s_%s_change"
            % (
                obj.company._meta.app_label,
                obj.company._meta.model_name,
            ),
            args=[obj.company.pk],
        )
        return format_html(
            '<a href="{}">{}</a>', company_admin_url, obj.company.user.email
        )

    get_company_email.short_description = "Company"
    get_category.short_description = "Category"

    search_fields = [
        "id",
        "name",
        "company__user__email",
        "status",
    ]
    raw_id_fields = (
        "company",
        "sub_category",
        "related_sub_categories",
    )
    filter_horizontal = ("activation_countries",)

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "slug",
                    "created_at",
                    "name",
                    "company",
                    "status",
                    "activation_countries",
                    "sort_order",
                    "total_views",
                )
            },
        ),
        (
            "Contact Information",
            {
                "fields": (
                    "website",
                    "country",
                    "city",
                    "street",
                    "number",
                    "full_address",
                )
            },
        ),
        (
            "Categorie Information",
            {
                "fields": (
                    "sub_category",
                    "related_sub_categories",
                )
            },
        ),
        (
            "Offered Services Information",
            {"fields": ("offered_services",)},
        ),
        (
            "Social Media Information",
            {
                "fields": (
                    "facebook",
                    "instagram",
                    "youtube",
                    "tiktok",
                    "twitter",
                    "others",
                )
            },
        ),
    )
    inlines = (
        GalleryInline,
        FAQInline,
    )


class CountyAdmin(admin.ModelAdmin):
    form = CountryAdminForm
    list_display = (
        "id",
        "name",
    )
    search_fields = [
        "id",
        "name",
    ]

    def save_model(self, request, obj, form, change):
        extra_image = form.cleaned_data.get("image_input")
        # obj.slug = unique_slugify(Country, obj.name, obj.id)
        if extra_image:
            s3_service = S3Service()
            upload_folder = "admin/countries"
            if obj.image_url:
                s3_service.delete_s3_object_by_url(obj.image_url)
            file_url = s3_service.upload_file(extra_image, "image/jpeg", upload_folder)
            obj.image_url = file_url
        super().save_model(request, obj, form, change)


class ServiceAdmin(admin.ModelAdmin):
    list_display = ("id",)
    search_fields = [
        "id",
    ]
    filter_horizontal = [
        "sub_category",
    ]


class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )
    search_fields = [
        "id",
        "name",
    ]


class SubCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "category",
        "name",
    )
    search_fields = [
        "id",
        "name",
    ]

    raw_id_fields = ("category",)


class GalleryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ad",
    )
    search_fields = [
        "id",
        "ad__name",
    ]


class ActivationSubCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sub_category",
    )
    search_fields = [
        "id",
        "sub_category__name",
    ]

    raw_id_fields = ("sub_category",)


class RelatedSubCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sub_category_1",
        "sub_category_2",
    )
    search_fields = [
        "id",
        "sub_category_1__name",
        "sub_category_2__name",
    ]

    raw_id_fields = (
        "sub_category_1",
        "sub_category_2",
    )


class FAQAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ad",
        "question",
        "answer",
    )
    search_fields = [
        "id",
        "ad__name",
        "question",
        "answer",
    ]

    raw_id_fields = ("ad",)


class SiteQuestionInline(admin.TabularInline):
    model = SiteQuestion
    extra = 1


class SiteFAQAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "category",
        "section",
    )
    search_fields = ["id", "category__name", "sub_category__name", "section__name"]
    raw_id_fields = (
        "category",
        "section",
    )
    filter_horizontal = ("sub_category",)
    inlines = (SiteQuestionInline,)


class SiteQuestionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "site_faq",
        "question",
        "suggestion",
    )
    search_fields = [
        "id",
        "site_faq",
        "question",
        "suggestion",
    ]
    raw_id_fields = ("site_faq",)


class AdFAQSite(admin.ModelAdmin):
    list_display = (
        "id",
        "ad",
        "site_question",
    )
    search_fields = [
        "id",
        "ad",
        "site_question",
    ]
    raw_id_fields = ("ad", "site_question")


admin.site.register(Ad, AdAdmin)
admin.site.register(Gallery, GalleryAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(SubCategory, SubCategoryAdmin)
admin.site.register(Country, CountyAdmin)
admin.site.register(FAQ, FAQAdmin)
admin.site.register(RelatedSubCategory, RelatedSubCategoryAdmin)
admin.site.register(ActivationSubCategory, ActivationSubCategoryAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(SiteFAQ, SiteFAQAdmin)
admin.site.register(SectionName, SectionAdmin)
admin.site.register(SiteQuestion, SiteQuestionAdmin)
admin.site.register(AdFAQ, AdFAQSite)
