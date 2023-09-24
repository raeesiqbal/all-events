from rest_framework import serializers


class InputSubscriptionIdSerializer(serializers.Serializer):
    subscription_id = serializers.CharField(required=True)
    price_id = serializers.CharField(required=True)
