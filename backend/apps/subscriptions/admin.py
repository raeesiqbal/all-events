# imports
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

# modelss
from apps.subscriptions.models import (
    Subscription,
    SubscriptionType,
    PaymentMethod,
)


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_company_email",
        "get_type_type",
        "status",
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

    def get_type_type(self, obj):
        type_admin_url = reverse(
            "admin:%s_%s_change"
            % (
                obj.type._meta.app_label,
                obj.type._meta.model_name,
            ),
            args=[obj.type.pk],
        )
        return format_html('<a href="{}">{}</a>', type_admin_url, obj.type.type)

    get_company_email.short_description = "Company Email"
    get_type_type.short_description = "Type"

    search_fields = [
        "id",
        "company__user__email",
        "type__type",
        "status",
    ]

    raw_id_fields = (
        "company",
        "type",
    )


class SubscriptionTypeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "type",
        "allowed_ads",
    )
    search_fields = [
        "id",
        "type",
    ]


class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_company_email",
        "brand",
        "payment_method_id",
    )
    search_fields = [
        "id",
        "company__email",
        "brand",
        "payment_method_id",
    ]

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

    get_company_email.short_description = "Company Email"


admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(SubscriptionType, SubscriptionTypeAdmin)
admin.site.register(PaymentMethod, PaymentMethodAdmin)
