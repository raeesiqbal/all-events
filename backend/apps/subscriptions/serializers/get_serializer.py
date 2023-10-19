from rest_framework import serializers
from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer
from apps.subscriptions.models import Subscription, SubscriptionType, PaymentMethod
from apps.subscriptions.stripe_service import StripeService


class TestSerializer(BaseSerializer):
    class Meta:
        model = Client
        fields = ["user"]


class SubscriptionTypeChildSerializer(BaseSerializer):
    class Meta:
        model = SubscriptionType
        fields = "__all__"


class CurrentSubscriptionSerializer(BaseSerializer):
    type = SubscriptionTypeChildSerializer()

    class Meta:
        model = Subscription
        fields = "__all__"


class MySubscriptionSerializer(BaseSerializer):
    type = SubscriptionTypeChildSerializer()
    unit_amount = serializers.SerializerMethodField()
    next_payment = serializers.SerializerMethodField()

    def get_unit_amount(self, obj):
        return obj.unit_amount / 100

    def get_next_payment (self, obj):
        
        return obj.unit_amount / 100

    class Meta:
        model = Subscription
        fields = [
            "subscription_id",
        ]


class SubscriptionDashboardSerializer(BaseSerializer):
    type = SubscriptionTypeChildSerializer()

    class Meta:
        model = Subscription
        fields = "__all__"


class GetPaymentMethodSerializer(BaseSerializer):
    class Meta:
        model = PaymentMethod
        fields = "__all__"
