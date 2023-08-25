from django.contrib import admin
from .models import Client


# Register your models here.
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
    )
    search_fields = [
        "id",
        "user__ email",
        "user__first_name",
        "user__last_name",
    ]

    raw_id_fields = ("user",)


admin.site.register(Client)
