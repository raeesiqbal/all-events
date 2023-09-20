# imports
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from apps.subscriptions.stripe_service import StripeService
from apps.utils.views.base import BaseViewset, ResponseInfo
from django.db.models import Q

# permissions
from apps.users.permissions import IsVendorUser

# constants
from apps.utils.constants import PRODUCT_NAMES
from apps.subscriptions.constants import SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES

# models
from apps.subscriptions.models import Subscription, SubscriptionType

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
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    stripe = stripe_service.get_stripe()

    @action(detail=False, url_path="products", methods=["get"])
    def public_products(self, request, *args, **kwargs):
        data = []

        products = self.stripe_service.list_products()
        price_data = {}

        for product in products.data:
            price = self.stripe_service.retrieve_product_price(product.default_price)
            price_data[product.default_price] = price

        for product in products.data:
            data.append(
                {
                    "id": product.id,
                    "name": product.name,
                    # "object": product.object,
                    "description": product.description,
                    # "images": product.images,
                    # "recurring": price_data[product.default_price]["recurring"],
                    "unit_price": price_data[product.default_price]["unit_amount"]
                    / 100,
                    "currency": price_data[product.default_price]["currency"],
                    "price_id": price_data[product.default_price]["id"],
                    "features": product.features,
                }
            )
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
                    if item["price_id"] == user_scription.price_id:
                        current_subscription = item
                        data.remove(item)
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
                    "data": data,
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

        if not company.stripe_customer_id:
            customer = self.stripe.Customer.create(email=request.user.email).id
            company.stripe_customer_id = customer
            company.save()
        else:
            customer = company.stripe_customer_id

        user_subscription = Subscription.objects.filter(
            company__user__email=request.user.email
        ).first()

        if (
            user_subscription.type.type == "free"
            and user_subscription.subscription_id == ""
        ):
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
            print(data)

        if event_type == "customer.subscription.deleted":
            # handle subscription canceled automatically based
            # upon your subscription settings. Or if the user cancels it.
            print(data)
        return Response({"message": "Webhook received successfully"})

    @action(detail=False, url_path="update-subscription", methods=["post"])
    def update_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription_id = serializer.validated_data.pop("subscription_id")
        price_id = serializer.validated_data.pop("price_id")
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

    # @action(detail=False, url_path="checkout", methods=["post"])
    # def create_subscription(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     price_id = serializer.validated_data.pop("price_id")

    #     domain_url = "http://localhost:8000/"

    #     sub = Subscription.objects.filter(
    #         company__user__email=request.user.email
    #     ).first()

    #     if sub and sub.stripe_customer_id:
    #         customer = sub.stripe_customer_id
    #     else:
    #         customer = stripe.Customer.create(email=request.user.email).id
    #         company = Company.objects.filter(user__email=request.user.email).first()
    #         Subscription.objects.create(stripe_customer_id=customer, company=company)

    #     checkout_session = self.stripe_service.create_session(
    #         customer,
    #         price_id,
    #         domain_url,
    #     )
    #     return Response(
    #         status=status.HTTP_200_OK,
    #         data=ResponseInfo().format_response(
    #             data=checkout_session["url"],
    #             status_code=status.HTTP_200_OK,
    #             message="Products List",
    #         ),
    #     )

    @action(detail=False, url_path="success", methods=["get"])
    def subscription_success(self, request, *args, **kwargs):
        sub = Subscription.objects.filter(
            company__user__email=request.user.email
        ).first()
        data = []
        if sub and sub.stripe_customer_id:
            subscriptions = stripe.Subscription.list(customer=sub.stripe_customer_id)

            sub.extras["plan"] = subscriptions.data[0]["plan"]
            product = stripe.Product.retrieve(
                id=subscriptions.data[0]["plan"]["product"]
            )
            product_name = product.name.lower()
            print(product_name)
            if product_name in PRODUCT_NAMES.keys():
                sub.type = PRODUCT_NAMES[product_name]
            sub.save()
            data = subscriptions["data"]

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Success"
            ),
        )

    # @action(detail=False, url_path="list", methods=["post"])
    # def product_subscription_list(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)

    #     subscriptions = stripe.Subscription.list(
    #         customer='cus_OZHgdjsrgvHWDM'        )
    #     print(len(subscriptions))

    #     return Response(
    #         status=status.HTTP_200_OK,
    #         data=ResponseInfo().format_response(
    #             data=subscriptions['data'], status_code=status.HTTP_200_OK, message="Products List"
    #         ),
    #     )
