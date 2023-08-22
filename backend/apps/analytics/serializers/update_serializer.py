from apps.analytics.models import Chat, Message
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class ChatIsArchivedSerializer(BaseSerializer):
    
    class Meta:
        model = Chat
        fields = ["is_archived"]

class MessageIsReadSerializer(BaseSerializer):
    
    message_id=serializers.IntegerField(required=True)
    class Meta:
        model = Message
        fields = ["message_id","is_read"]