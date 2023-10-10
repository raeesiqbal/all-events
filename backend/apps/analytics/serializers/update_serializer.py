from apps.analytics.models import Calender
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers

from django.db.models.fields import DateField


class ChatIsArchivedSerializer(serializers.Serializer):
    is_archived = serializers.BooleanField(required=True)


# class MessageIsReadSerializer(BaseSerializer):
#     message_id = serializers.IntegerField(required=True)

#     class Meta:
#         model = Message
#         fields = ["message_id", "is_read"]


class MessageIsReadSerializer(serializers.Serializer):
    is_read = serializers.BooleanField(required=True)


class CalenderAvailabilityUpdateSerializer(BaseSerializer):
    class Meta:
        model = Calender
        fields = ["hide"]


# class CalenderUpdateSerializer(serializers.Serializer):
#     dates = serializers.ListField(child=serializers.CharField())
#     reason = serializers.CharField()
#     availability = serializers.CharField()


class CalenderUpdateSerializer(serializers.Serializer):
    start_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    end_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    reason = serializers.CharField()
    availability = serializers.CharField()
