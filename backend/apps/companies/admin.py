from django.contrib import admin

# Register your models here.
from .models import Company


class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "is_active",
    )
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
