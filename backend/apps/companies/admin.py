# imports
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

# models
from .models import Company


class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_email",
        "name",
        "is_active",
    )

    def get_email(self, obj):
        user_admin_url = reverse(
            "admin:%s_%s_change"
            % (
                obj.user._meta.app_label,
                obj.user._meta.model_name,
            ),
            args=[obj.user.pk],
        )
        return format_html('<a href="{}">{}</a>', user_admin_url, obj.user.email)

    get_email.short_description = "Email"

    search_fields = [
        "id",
        "name",
        "is_active",
        "postal_code",
        "fiscal_code",
        "address",
    ]

    raw_id_fields = (
        "country",
        "user",
    )


admin.site.register(Company, CompanyAdmin)
