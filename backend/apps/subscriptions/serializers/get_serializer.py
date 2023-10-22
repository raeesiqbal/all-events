from rest_framework import serializers
from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer
from apps.subscriptions.models import Subscription, SubscriptionType, PaymentMethod
from apps.subscriptions.stripe_service import StripeService
import datetime


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
    # type = SubscriptionTypeChildSerializer()
    unit_amount = serializers.SerializerMethodField()
    next_payment = serializers.SerializerMethodField()
    interval = serializers.SerializerMethodField()
    interval_count = serializers.SerializerMethodField()
    cancel_at_period_end = serializers.SerializerMethodField()
    cancel_date = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    allowed_ads = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            "subscription_id",
            "unit_amount",
            "next_payment",
            "interval",
            "interval_count",
            "cancel_at_period_end",
            "cancel_date",
            "name",
            "allowed_ads",
            "created_at",
            "price_id",
            "status",
        ]

    def get_unit_amount(self, obj):
        if obj.unit_amount:
            unit_amount = float(obj.unit_amount) / 100
        else:
            unit_amount = None
        return unit_amount

    def get_next_payment(self, obj):
        if obj.stripe_subscription:
            if obj.stripe_subscription.get("current_period_end", None):
                next_payment_date = datetime.datetime.utcfromtimestamp(
                    obj.stripe_subscription["current_period_end"]
                ).strftime("%Y-%m-%d %H:%M:%S UTC")
            else:
                next_payment_date = None
        else:
            next_payment_date = None

        return next_payment_date

    def get_interval(self, obj):
        if obj.stripe_subscription:
            interval = obj.stripe_subscription["items"]["data"][0]["price"][
                "recurring"
            ]["interval"]
        else:
            interval = None
        return interval

    def get_interval_count(self, obj):
        if obj.stripe_subscription:
            interval_count = obj.stripe_subscription["items"]["data"][0]["price"][
                "recurring"
            ]["interval_count"]
        else:
            interval_count = None
        return interval_count

    def get_cancel_at_period_end(self, obj):
        if obj.stripe_subscription:
            cancel_at_period_end = obj.stripe_subscription["cancel_at_period_end"]
        else:
            cancel_at_period_end = None
        return cancel_at_period_end

    def get_cancel_date(self, obj):
        if obj.stripe_subscription:
            if obj.stripe_subscription["cancel_at"]:
                cancel_date = datetime.datetime.utcfromtimestamp(
                    obj.stripe_subscription["cancel_at"]
                ).strftime("%Y-%m-%d %H:%M:%S UTC")
            else:
                cancel_date = None
        else:
            cancel_date = None
        return cancel_date

    def get_name(self, obj):
        if obj.stripe_product:
            name = obj.stripe_product["name"]
        else:
            name = obj.type.type
        return name

    def get_allowed_ads(self, obj):
        if obj.stripe_product:
            allowed_ads = obj.stripe_product["metadata"]["allowed_ads"]
        else:
            allowed_ads = obj.type.allowed_ads
        return allowed_ads

    def get_created_at(self, obj):
        if obj.stripe_subscription:
            if obj.stripe_subscription["created"]:
                created_date = datetime.datetime.utcfromtimestamp(
                    obj.stripe_subscription["created"]
                ).strftime("%Y-%m-%d %H:%M:%S UTC")
            else:
                created_date = None
        else:
            created_date = None
        return created_date


class SubscriptionDashboardSerializer(BaseSerializer):
    type = SubscriptionTypeChildSerializer()

    class Meta:
        model = Subscription
        fields = "__all__"


class GetPaymentMethodSerializer(BaseSerializer):
    class Meta:
        model = PaymentMethod
        fields = "__all__"
