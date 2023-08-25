from django.contrib import admin
from .models import FavouriteAd, Chat, Message, AdReview, ContactRequest


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
        "client__email",
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
        "chat",
        "sender",
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
        "client__email",
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


admin.site.register(FavouriteAd, FavouriteAdAdmin)
admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(AdReview, AdReviewAdmin)
admin.site.register(ContactRequest, ContactRequestAdmin)
