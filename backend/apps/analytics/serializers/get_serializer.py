from apps.analytics.models import AdReview, Chat, Message
from apps.utils.serializers.base import BaseSerializer


class AdReviewGetSerializer(BaseSerializer):
    
    class Meta:
        model = AdReview
        fields = "__all__"


class MessageGetChildSerializer(BaseSerializer):
    
    class Meta:
        model = Message
        fields = ["sender","text"]


class ChatListSerializer(BaseSerializer):
    
    chat_messages=MessageGetChildSerializer(many=True)
    class Meta:
        model = Chat
        fields = ["client","ad","event_date","chat_messages"]