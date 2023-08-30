from apps.analytics.models import AdReview, Chat, FavouriteAd, Message
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class FavouriteAdCreateSerializer(BaseSerializer):
    class Meta:
        model = FavouriteAd
        fields = [
            "ad",
        ]


class AdReviewCreateSerializer(BaseSerializer):
    class Meta:
        model = AdReview
        fields = "__all__"


class MessageChildSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = ["text"]


# class AdChatCreateSerializer(BaseSerializer):
#     chat_messages = MessageChildSerializer(many=True)

#     class Meta:
#         model = Chat
#         fields = ["client", "ad", "event_date", "chat_messages"]


class AdChatCreateSerializer(BaseSerializer):
    message = serializers.CharField(max_length=999)

    class Meta:
        model = Chat
        fields = [
            "ad",
            "event_date",
            "message",
        ]


class AdMessageCreateSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = ["text"]
