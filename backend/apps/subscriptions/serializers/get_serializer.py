from rest_framework import serializers
from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer
from apps.subscriptions.models import Subscription, SubscriptionType


class TestSerializer(BaseSerializer):
    class Meta:
        model = Client
        fields = ["user"]


class SubscriptionTypeChildSerializer(BaseSerializer):
    class Meta:
        model = SubscriptionType
        fields = "__all__"


class MySubscriptionsSerializer(BaseSerializer):
    type = SubscriptionTypeChildSerializer()

    class Meta:
        model = Subscription
        fields = "__all__"

class SubscriptionDashboardSerializer(BaseSerializer):
    type = SubscriptionTypeChildSerializer()
    class Meta:
        model = Subscription
        fields = "__all__"
