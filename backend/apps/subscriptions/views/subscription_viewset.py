# imports
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from apps.subscriptions.stripe_service import StripeService, WebHookService
from apps.utils.views.base import BaseViewset, ResponseInfo
from django.db.models import Q

# permissions
from apps.users.permissions import IsVendorUser

# constants
from apps.utils.constants import PRODUCT_NAMES
from apps.subscriptions.constants import SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES

# models
from apps.subscriptions.models import Subscription, SubscriptionType
from apps.ads.models import Ad

# serializers
from apps.subscriptions.serializers.create_serializer import (
    CreateCustomerSerializer,
    InputPriceIdSerializer,
)
from apps.subscriptions.serializers.get_serializer import (
    TestSerializer,
    MySubscriptionsSerializer,
)

from apps.subscriptions.serializers.update_serializer import (
    InputSubscriptionIdSerializer,
)


class SubscriptionsViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = Subscription.objects.all()
    action_serializers = {
        "default": TestSerializer,
        "create_subscription": CreateCustomerSerializer,
        "update_subscription": InputSubscriptionIdSerializer,
        "product_subscription_list": InputPriceIdSerializer,
        "my_subscriptions": MySubscriptionsSerializer,
    }
    action_permissions = {
        "default": [],
        "create_subscription": [IsAuthenticated, IsVendorUser],
        "update_subscription": [IsAuthenticated, IsVendorUser],
        "subscription_success": [IsAuthenticated, IsVendorUser],
        "my_subscriptions": [IsAuthenticated, IsVendorUser],
    }
    stripe_service = StripeService()
    webhook_service = WebHookService()
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    stripe = stripe_service.get_stripe()

    @action(detail=False, url_path="products", methods=["get"])
    def public_products(self, request, *args, **kwargs):
        data = []
        products = self.stripe_service.list_products()
        for product in products.data:
            product_dic = {
                "id": product.id,
                "name": product.name,
                "allowed_ads": product.metadata.allowed_ads,
                "description": product.description,
                "prices": [],
                "features": product.features,
            }

            prices = self.stripe.Price.list(product=product.id)

            for p in prices.data:
                price_dic = {
                    "unit_price": p.unit_amount / 100,
                    "currency": p.currency,
                    "price_id": p.id,
                    "interval": p.recurring.interval,
                    "interval_count": p.recurring.interval_count,
                }
                product_dic["prices"].append(price_dic)

            data.append(product_dic)

        current_subscription = {
            "name": "FREE",
            "validity": "90 days",
            "price": "free",
            "features": [
                {"Allowed ads 1": "You Can Post only 1 Ad with free plan"},
                {
                    "Limited Access": "You will not have access to premium features like Analytics etc"
                },
                {"Limited Media Upload": "You can only post 1 photo and 1 video"},
            ],
        }
        current_subscription = None
        current_subscription_price = None
        current_subscription_product = None
        if request.user.is_authenticated:
            free_subscription = SubscriptionType.objects.filter(
                type=SUBSCRIPTION_TYPES["FREE"]
            ).first()
            user_scription = (
                Subscription.objects.filter(company__user__email=request.user.email)
                .exclude(type=free_subscription)
                .first()
            )
            if user_scription:
                for item in data:
                    for price in item.prices:
                        if price.price_id == user_scription.price_id:
                            current_subscription_price = price
                            current_subscription_product = item
                            item["prices"].remove(price)
                current_subscription = current_subscription_product
                current_subscription.prices = current_subscription_price
            else:
                current_subscription = {
                    "name": "FREE",
                    "validity": "90 days",
                    "price": "free",
                    "features": [
                        {"Allowed ads 1": "You Can Post only 1 Ad with free plan"},
                        {
                            "Limited Access": "You will not have access to premium features like Analytics etc"
                        },
                        {
                            "Limited Media Upload": "You can only post 1 photo and 1 video"
                        },
                    ],
                }
        free_plan = {
            "name": "FREE",
            "validity": "90 days",
            "price": "free",
            "features": [
                {"Allowed ads 1": "You Can Post only 1 Ad with free plan"},
                {
                    "Limited Access": "You will not have access to premium features like Analytics etc"
                },
                {"Limited Media Upload": "You can only post 1 photo and 1 video"},
            ],
        }

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "products": data,
                    "current_subscription": current_subscription,
                    "free_plan": free_plan,
                },
                status_code=status.HTTP_200_OK,
                message="Products List",
            ),
        )

    @action(detail=False, url_path="create-subscription", methods=["post"])
    def create_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        price_id = serializer.validated_data.pop("price_id")
        company = request.user.user_company

        # stripe customer
        if not company.stripe_customer_id:
            customer = self.stripe.Customer.create(email=request.user.email).id
            company.stripe_customer_id = customer
            company.save()
        else:
            customer = company.stripe_customer_id

        user_subscription = Subscription.objects.filter(
            company__user__email=request.user.email
        ).first()

        if not user_subscription.subscription_id:
            subscription = self.stripe_service.create_subscription(customer, price_id)
            user_subscription.subscription_id = subscription.id
            user_subscription.stripe_customer_id = customer
            user_subscription.price_id = subscription["items"].data[0].price.id
            user_subscription.unit_amount = (
                subscription["items"].data[0].price.unit_amount
            )
            user_subscription.latest_invoice_id = subscription.latest_invoice.id
            user_subscription.client_secret = (
                subscription.latest_invoice.payment_intent.client_secret
            )
            user_subscription.save()

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={
                        "subscriptionId": subscription.id,
                        "clientSecret": subscription.latest_invoice.payment_intent.client_secret,
                    },
                    status_code=status.HTTP_200_OK,
                    message="Subscription Created",
                ),
            )
        else:
            if price_id == user_subscription.price_id:
                return Response(
                    status=status.HTTP_200_OK,
                    data=ResponseInfo().format_response(
                        data={
                            "subscriptionId": user_subscription.subscription_id,
                            "clientSecret": user_subscription.client_secret,
                        },
                        status_code=status.HTTP_200_OK,
                        message="Subscription info",
                    ),
                )
            else:
                self.stripe.Subscription.delete(user_subscription.subscription_id)

                subscription = self.stripe_service.create_subscription(
                    customer, price_id
                )

                user_subscription.subscription_id = subscription.id
                user_subscription.stripe_customer_id = customer
                user_subscription.price_id = subscription["items"].data[0].price.id
                user_subscription.unit_amount = (
                    subscription["items"].data[0].price.unit_amount
                )
                user_subscription.latest_invoice_id = subscription.latest_invoice.id
                user_subscription.client_secret = (
                    subscription.latest_invoice.payment_intent.client_secret
                )
                user_subscription.save()

                return Response(
                    status=status.HTTP_200_OK,
                    data=ResponseInfo().format_response(
                        data={
                            "subscriptionId": subscription.id,
                            "clientSecret": subscription.latest_invoice.payment_intent.client_secret,
                        },
                        status_code=status.HTTP_200_OK,
                        message="Subscription Created",
                    ),
                )

    @action(detail=False, url_path="my-subscriptions", methods=["get"])
    def my_subscriptions(self, request, *args, **kwargs):
        my_subscriptions = Subscription.objects.filter(
            company__user__email=request.user.email,
            status=SUBSCRIPTION_STATUS["ACTIVE"],
        )
        serializer = self.get_serializer(my_subscriptions, many=True).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=serializer,
                status_code=status.HTTP_200_OK,
                message="My subscriptions",
            ),
        )

    @action(detail=False, url_path="webhook", methods=["post"])
    def webhook(self, request, *args, **kwargs):
        payload = request.body.decode("utf-8")
        if self.webhook_secret:
            # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
            signature = request.headers.get("stripe-signature")
            try:
                event = self.stripe.Webhook.construct_event(
                    payload=payload,
                    sig_header=signature,
                    secret=self.webhook_secret,
                )
                data = event["data"]
            except Exception as e:
                return e
            # Get the type of webhook event sent - used to check the status of PaymentIntents.
            event_type = event["type"]
        else:
            data = payload["data"]
            event_type = payload["type"]

        data_object = data["object"]

        if event_type == "invoice.paid":
            subscription = Subscription.objects.filter(
                stripe_customer_id=data_object.customer
            ).first()
            if not subscription:
                return Response({"message": "Webhook received successfully"})
            s = self.stripe.Subscription.retrieve(
                subscription.subscription_id,
            )
            if s.status == "active":
                if s["items"].data[0].price.unit_amount == 100:
                    updated_type = SUBSCRIPTION_TYPES["STANDARD"]
                elif s["items"].data[0].price.unit_amount == 200:
                    updated_type = SUBSCRIPTION_TYPES["ADVANCED"]
                elif s["items"].data[0].price.unit_amount == 300:
                    updated_type = SUBSCRIPTION_TYPES["FEATURED"]
                updated_type = SubscriptionType.objects.filter(
                    type=updated_type
                ).first()
                subscription.status = SUBSCRIPTION_STATUS["ACTIVE"]
                subscription.type = updated_type
                subscription.price_id = s["items"].data[0].price.id
                subscription.unit_amount = s["items"].data[0].price.unit_amount
                subscription.latest_invoice_id = s.latest_invoice.id
                subscription.client_secret = (
                    s.latest_invoice.payment_intent.client_secret
                )
                subscription.latest_invoice_id = s.latest_invoice.id
                subscription.client_secret = (
                    s.latest_invoice.payment_intent.client_secret
                )
                subscription.save()

        if event_type == "invoice.payment_failed":
            # If the payment fails or the customer does not have a valid payment method,
            # an invoice.payment_failed event is sent, the subscription becomes past_due.
            # Use this webhook to notify your user that their payment has
            # failed and to retrieve new card details.
            print(data_object)

        if event_type == "customer.subscription.updated":
            if Subscription.objects.filter(subscription_id=data_object.id).exists():
                # if subscription expired without payment after 24 hrs, it will be removed
                if data_object.status == "incomplete_expired":
                    self.webhook_service.clear_subscription_model(data_object.id)
        return Response({"message": "Webhook received successfully"})

    @action(detail=False, url_path="update-subscription", methods=["post"])
    def update_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription_id = serializer.validated_data.pop("subscription_id")
        price_id = serializer.validated_data.pop("price_id")
        allowed_ads = serializer.validated_data.pop("allowed_ads")

        retrieve_subscription = self.stripe_service.retrieve_subscription(
            subscription_id
        )

        retrieve_old_product = self.stripe_service.retrieve_product(
            retrieve_subscription["items"].data[0].price.product
        )

        if retrieve_old_product.metadata.allowed_ads > allowed_ads:
            vendor_ads = Ad.objects.filter(company=request.user.user_company).count()
            if vendor_ads > allowed_ads:
                return Response(
                    status=status.HTTP_200_OK,
                    data=ResponseInfo().format_response(
                        data={"updated": False},
                        status_code=status.HTTP_200_OK,
                        message=f"You cann't upgrade to this plan. Your Current Active Ad count is {vendor_ads}, while the plan you want to upgrade allow {allowed_ads} ads upload. Please delete your unwanted ads first.",
                    ),
                )

        update_subscription = self.stripe_service.update_subscription(
            subscription_id, price_id
        )

        if update_subscription:
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={},
                    status_code=status.HTTP_200_OK,
                    message="Your Subscription will be changed after invoice has been paid successfully",
                ),
            )
