from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer
from rest_framework import serializers


class CreateCustomerSerializer(BaseSerializer):
    # email=serializers.EmailField()
    price_id = serializers.CharField()

    class Meta:
        model = Client
        fields = ["price_id"]


class InputPriceIdSerializer(BaseSerializer):
    price_id = serializers.CharField()

    class Meta:
        model = Client
        fields = ["price_id"]
