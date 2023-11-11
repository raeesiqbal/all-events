from rest_framework import serializers


class SubscriptionUpdateSerializer(serializers.Serializer):
    price_id = serializers.CharField(required=True)
    allowed_ads = serializers.IntegerField(required=True)
