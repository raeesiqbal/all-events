from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class CreateCustomerSerializer(BaseSerializer):
    price_id = serializers.CharField()
    # allowed_ads = serializers.IntegerField()

    class Meta:
        model = Client
        fields = ["price_id"]


class InputPriceIdSerializer(serializers.Serializer):
    price_id = serializers.CharField()
