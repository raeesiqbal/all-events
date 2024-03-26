# Imports
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

# Models
from .models import (
    FavouriteAd,
    Chat,
    Message,
    AdReview,
    ContactRequest,
    Calender,
    AdView,
)


# Register your models here.
class FavouriteAdAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ad",
        "user",
    )
    search_fields = [
        "id",
        "ad__name",
        "user__email",
    ]

    raw_id_fields = (
        "ad",
        "user",
    )


class ChatAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "client",
        "ad",
        "event_date",
        "latest_message",
    )
    search_fields = [
        "id",
        "ad__name",
        "event_date",
        "latest_message__text",
    ]

    raw_id_fields = (
        "ad",
        "client",
        "latest_message",
    )


class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "chat",
        "sender",
        "text",
    )
    search_fields = [
        "id",
        "chat__ad__name",
        "sender__email",
        "text",
    ]

    raw_id_fields = (
        "chat",
        "sender",
    )


class AdReviewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "ad",
        "client",
        "name",
        "rating",
    )
    search_fields = [
        "id",
        "title",
        "ad__name",
        "name",
        "rating",
    ]

    raw_id_fields = (
        "ad",
        "client",
    )


class ContactRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ad",
        "email",
        "full_name",
        "phone",
        "message",
    )
    search_fields = [
        "id",
        "ad",
        "email",
        "full_name",
        "phone",
        "message",
    ]

    raw_id_fields = ("ad",)


class CalenderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "company",
        "ad",
        "hide",
    )
    search_fields = [
        "id",
        "company__email",
        "ad__name",
        "hide",
    ]

    raw_id_fields = ("ad", "company")


class AdViewAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_ad_name",
        "get_user_email",
        "visitor_ip",
    )
    search_fields = [
        "id",
        "visitor_ip",
        "user__email",
        "ad__name",
        "hide",
    ]

    raw_id_fields = ("ad", "user")

    def get_ad_name(self, obj):
        admin_ad_url = reverse(
            "admin:%s_%s_change"
            % (
                obj.ad._meta.app_label,
                obj.ad._meta.model_name,
            ),
            args=[obj.ad.pk],
        )
        return format_html('<a href="{}">{}</a>', admin_ad_url, obj.ad.name)

    def get_user_email(self, obj):
        if obj.user:
            admin_user_url = reverse(
                "admin:%s_%s_change"
                % (
                    obj.user._meta.app_label,
                    obj.user._meta.model_name,
                ),
                args=[obj.user.pk],
            )
            return format_html('<a href="{}">{}</a>', admin_user_url, obj.user.email)
        else:
            return None

    get_ad_name.short_description = "Ad"
    get_user_email.short_description = "Email"


admin.site.register(FavouriteAd, FavouriteAdAdmin)
admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(AdReview, AdReviewAdmin)
admin.site.register(ContactRequest, ContactRequestAdmin)
admin.site.register(Calender, CalenderAdmin)
admin.site.register(AdView, AdViewAdmin)
