from apps.analytics.models import AdReview, Chat, Message, ContactRequest
from apps.utils.serializers.base import BaseSerializer
from apps.ads.models import Ad, Gallery
from apps.ads.serializers.get_serializers import GalleryChildSerializer
from rest_framework import serializers
from apps.clients.models import Client
from apps.users.models import User


class AdContactGetSerializer(BaseSerializer):
    class Meta:
        model = ContactRequest
        fields = "__all__"


class AdReviewGetSerializer(BaseSerializer):
    class Meta:
        model = AdReview
        fields = "__all__"


class MessageGetChildSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = ["sender", "text"]


# class ChatListSerializer(BaseSerializer):
#     chat_messages = MessageGetChildSerializer(many=True)

#     class Meta:
#         model = Chat
#         fields = ["client", "ad", "event_date", "chat_messages"]


# class AdChildSerializer(BaseSerializer):
#     ad_s = serializers.SerializerMethodField("get_ad_saved_count")

#     class Meta:
#         model = Ad
#         fields = [
#             "name",
#             "ad_media",
#         ]


class MessageChildSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = [
            "text",
            "created_at",
        ]


class UserChildSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone",
        ]


class ClientChildSerializer(BaseSerializer):
    user = UserChildSerializer()

    class Meta:
        model = Client
        fields = ["user"]


class ChatListSerializer(BaseSerializer):
    client = ClientChildSerializer()
    latest_message = MessageChildSerializer()
    ad_image = serializers.SerializerMethodField("get_ad_image")

    def get_ad_image(self, obj):
        gallery = Gallery.objects.filter(ad=obj.ad).first()

        return (
            gallery.media_urls.get("images")[0]
            if gallery.media_urls.get("images")[0]
            else None
        )

    class Meta:
        model = Chat
        fields = [
            "id",
            "ad_image",
            "client",
            "event_date",
            "latest_message",
            "is_archived_vendor",
            "is_archived_client",
            "is_read_vendor",
            "is_read_client",
        ]


class ChatMessageSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = [
            "text",
            "created_at",
        ]
