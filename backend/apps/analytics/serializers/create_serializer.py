from apps.ads.models import Ad
from apps.analytics.models import AdReview, Chat, FavouriteAd,Message
from apps.clients.models import Client
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class FavouriteAdCreateSerializer(BaseSerializer):
    
    class Meta:
        model = FavouriteAd
        fields = ["ad"]

class AdReviewCreateSerializer(BaseSerializer):
    
    class Meta:
        model = AdReview
        fields = "__all__"

class MessageChildSerializer(BaseSerializer):
    
    class Meta:
        model = Message
        fields = ["sender","text"]


class AdChatCreateSerializer(BaseSerializer):
    
    chat_messages=MessageChildSerializer(many=True)
   
    class Meta:
        model = Chat
        fields = ["client","ad","event_date","chat_messages"]