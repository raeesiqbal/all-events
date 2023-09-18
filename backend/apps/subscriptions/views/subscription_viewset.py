from django.conf import settings
import stripe
from rest_framework.permissions import IsAuthenticated
from apps.companies.models import Company
from apps.subscriptions.models import Subscription
from apps.users.permissions import IsSuperAdmin, IsVendorUser

from rest_framework.response import Response
from rest_framework import status
from apps.clients.models import Client
from rest_framework.decorators import action
from apps.subscriptions.serializers.create_serializer import (
    CreateCustomerSerializer,
    InputPriceIdSerializer,
)

from apps.subscriptions.serializers.get_serializer import (
    TestSerializer,
    MySubscriptionsSerializer,
)
from apps.subscriptions.stripe_service import StripeService
from apps.utils.constants import PRODUCT_NAMES

from apps.utils.views.base import BaseViewset, ResponseInfo
from django.conf import settings
import json


class SubscriptionsViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = Subscription.objects.all()
    action_serializers = {
        "default": TestSerializer,
        "create_subscription": CreateCustomerSerializer,
        "product_subscription_list": InputPriceIdSerializer,
        "my_subscriptions": MySubscriptionsSerializer,
    }
    action_permissions = {
        "default": [],
        "create_subscription": [IsAuthenticated, IsVendorUser],
        "subscription_success": [IsAuthenticated, IsVendorUser],
        "my_subscriptions": [IsAuthenticated, IsVendorUser],
    }
    stripe_service = StripeService()

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
                    "object": product.object,
                    "description": product.description,
                    "images": product.images,
                    "recurring": price_data[product.default_price]["recurring"],
                    "unit_price": price_data[product.default_price]["unit_amount"]
                    / 100,
                    "currency": price_data[product.default_price]["currency"],
                    "price_id": price_data[product.default_price]["id"],
                    "features": product.features,
                }
            )

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Products List"
            ),
        )

    @action(detail=False, url_path="create-subscription", methods=["post"])
    def create_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        price_id = serializer.validated_data.pop("price_id")
        stripe = self.stripe_service.get_stripe()
        company = request.user.user_company

        if not company.stripe_customer_id:
            customer = stripe.Customer.create(email=request.user.email).id
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
                stripe.Subscription.delete(user_subscription.subscription_id)
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
            company__user__email=request.user.email
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
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET
        request_data = request.data
        print(request_data)

        if webhook_secret:
            # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
            signature = request.headers.get("stripe-signature")
            try:
                event = stripe.Webhook.construct_event(
                    payload=request.data, sig_header=signature, secret=webhook_secret
                )
                data = event["data"]
            except Exception as e:
                return e
            # Get the type of webhook event sent - used to check the status of PaymentIntents.
            event_type = event["type"]
        else:
            data = request_data["data"]
            event_type = request_data["type"]

        data_object = data["object"]

        if event_type == "invoice.paid":
            print("okkkkkkkkkkkkkkkk")
            # Used to provision services after the trial has ended.
            # The status of the invoice will show up as paid. Store the status in your
            # database to reference when a user accesses your service to avoid hitting rate
            # limits.
            print(data)

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
