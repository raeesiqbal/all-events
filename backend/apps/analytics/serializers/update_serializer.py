from apps.analytics.models import Chat, Message
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class ChatIsArchivedSerializer(serializers.Serializer):
    is_archived = serializers.BooleanField(required=True)


# class MessageIsReadSerializer(BaseSerializer):
#     message_id = serializers.IntegerField(required=True)

#     class Meta:
#         model = Message
#         fields = ["message_id", "is_read"]


class MessageIsReadSerializer(serializers.Serializer):
    is_read = serializers.BooleanField(required=True)
