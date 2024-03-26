# Imports
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers
from apps.analytics.models import (
    AdReview,
    Chat,
    Calender,
    Message,
    AdView,
)


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
