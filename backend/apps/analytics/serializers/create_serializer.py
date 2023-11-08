from apps.analytics.models import AdReview, Chat, Calender, Message
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class AdReviewCreateSerializer(BaseSerializer):
    class Meta:
        model = AdReview
        fields = [
            "title",
            "rating",
            "message",
            "photos",
        ]


class MessageChildSerializer(BaseSerializer):
    class Meta:
        model = Message
        fields = ["text", "attachments"]


# class AdChatCreateSerializer(BaseSerializer):
#     chat_messages = MessageChildSerializer(many=True)

#     class Meta:
#         model = Chat
#         fields = ["client", "ad", "event_date", "chat_messages"]


class CalenderCreateSerializer(BaseSerializer):
    class Meta:
        model = Calender
        fields = ["ad", "dates"]


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
        fields = ["text", "attachments"]
