from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as DjanoAdmin

# Register your models here.


class UserAdmin(DjanoAdmin):
    model = User
    list_display = (
        "id",
        "email",
        "role_type",
        "is_active",
    )
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone",
                    "newsletter",
                    "terms_acceptance",
                )
            },
        ),
        (
            "Account Type",
            {
                "fields": (
                    "role_type",
                    "is_active",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "role_type",
                ),
            },
        ),
    )
    ordering = ("email",)
    search_fields = (
        "email",
        "role_type",
    )


admin.site.register(User, UserAdmin)
