from apps.analytics.models import Calender
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers
from django.utils import timezone
from django.db.models.fields import DateField
from datetime import datetime


class ChatIsArchivedSerializer(serializers.Serializer):
    is_archived = serializers.BooleanField(required=True)


class MessageIsReadSerializer(serializers.Serializer):
    is_read = serializers.BooleanField(required=True)


class CalenderAvailabilityUpdateSerializer(BaseSerializer):
    class Meta:
        model = Calender
        fields = ["hide"]


class CalenderUpdateSerializer(serializers.Serializer):
    start_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    end_date = serializers.DateField(input_formats=["%Y-%m-%d"])
    reason = serializers.CharField()
    availability = serializers.CharField()

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        print("start", start_date)
        print("start", end_date)

        # Assuming your timezone is 'UTC'
        start_date = timezone.make_aware(
            datetime.combine(start_date, datetime.min.time()), timezone=timezone.utc
        )
        end_date = timezone.make_aware(
            datetime.combine(end_date, datetime.max.time()), timezone=timezone.utc
        )

        data["start_date"] = start_date
        data["end_date"] = end_date

        return data
