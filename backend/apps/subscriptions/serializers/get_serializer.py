from rest_framework import serializers
from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer
from apps.subscriptions.models import Subscription


class TestSerializer(BaseSerializer):
    class Meta:
        model = Client
        fields = ["user"]


class MySubscriptionsSerializer(BaseSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = "__all__"

    def get_type(self, obj):
        return obj.type.type
