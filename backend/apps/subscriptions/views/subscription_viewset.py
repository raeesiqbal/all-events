# imports
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from apps.subscriptions.stripe_service import StripeService, WebHookService
from apps.utils.views.base import BaseViewset, ResponseInfo
from django.db.models import Q
from django.core import serializers
import datetime

# permissions
from apps.users.permissions import IsVendorUser

# constants
from apps.utils.constants import PRODUCT_NAMES
from apps.subscriptions.constants import SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES

# models
from apps.subscriptions.models import Subscription, SubscriptionType, PaymentMethod
from apps.ads.models import Ad
from apps.companies.models import Company

# serializers
from apps.subscriptions.serializers.create_serializer import (
    CreateCustomerSerializer,
    InputPriceIdSerializer,
)
from apps.subscriptions.serializers.get_serializer import (
    TestSerializer,
    CurrentSubscriptionSerializer,
    GetPaymentMethodSerializer,
)

from apps.subscriptions.serializers.update_serializer import (
    InputSubscriptionIdSerializer,
    CancelSubscriptionSerializer,
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
        "cancel_subscription": CancelSubscriptionSerializer,
        "resume_subscription": CancelSubscriptionSerializer,
        "product_subscription_list": InputPriceIdSerializer,
        "current_subscription": CurrentSubscriptionSerializer,
        "get_payment_method": GetPaymentMethodSerializer,
    }
    action_permissions = {
        "default": [],
        "create_subscription": [IsAuthenticated, IsVendorUser],
        "update_subscription": [IsAuthenticated, IsVendorUser],
        "cancel_subscription": [IsAuthenticated, IsVendorUser],
        "resume_subscription": [IsAuthenticated, IsVendorUser],
        "subscription_success": [IsAuthenticated, IsVendorUser],
        "my_subscriptions": [IsAuthenticated, IsVendorUser],
        "current_subscription": [IsAuthenticated, IsVendorUser],
        "update_payment_method": [IsAuthenticated, IsVendorUser],
        "get_payment_method": [IsAuthenticated, IsVendorUser],
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
                    for price in item["prices"]:
                        if price["price_id"] == user_scription.price_id:
                            current_subscription_price = price
                            break
                current_subscription = {
                    "price_id": current_subscription_price["price_id"],
                    "interval": current_subscription_price["interval"],
                    "interval_count": current_subscription_price["interval_count"],
                    "subscription_id": user_scription.subscription_id,
                }

        free_plan = {
            "id": "freeplan",
            "name": "FREE",
            "allowed_ads": "1",
            "description": "I am Free Plan",
            "prices": [
                {
                    "unit_price": 0,
                    "currency": "usd",
                    "interval": "month",
                    "interval_count": 3,
                }
            ],
            "features": [
                {"name": "[Validity 90 Days](This plan is valid for 90 days)"},
                {"name": "[Ads Allowed 1](You can post only ad)"},
                {
                    "name": "[Limited Access](This plan supports very limited access to our premium features)"
                },
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

        incomplete_subscriptions = self.stripe_service.list_subscriptions(customer)
        if incomplete_subscriptions:
            for i in incomplete_subscriptions:
                self.stripe_service.cancel_subscription(i.id)

        # user_subscription = Subscription.objects.filter(
        #     company__user__email=request.user.email
        # ).first()

        # if not user_subscription.subscription_id:
        subscription = self.stripe_service.create_subscription(customer, price_id)

        # user_subscription.subscription_id = subscription.id
        # user_subscription.stripe_customer_id = customer
        # user_subscription.price_id = subscription["items"].data[0].price.id
        # user_subscription.unit_amount = subscription["items"].data[0].price.unit_amount
        # user_subscription.latest_invoice_id = subscription.latest_invoice.id
        # user_subscription.client_secret = (
        #     subscription.latest_invoice.payment_intent.client_secret
        # )
        # user_subscription.save()

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

        # else:
        #     if price_id == user_subscription.price_id:
        #         return Response(
        #             status=status.HTTP_200_OK,
        #             data=ResponseInfo().format_response(
        #                 data={
        #                     "subscriptionId": user_subscription.subscription_id,
        #                     "clientSecret": user_subscription.client_secret,
        #                 },
        #                 status_code=status.HTTP_200_OK,
        #                 message="Subscription info",
        #             ),
        #         )
        #     else:
        #         self.stripe.Subscription.delete(user_subscription.subscription_id)

        #         subscription = self.stripe_service.create_subscription(
        #             customer, price_id
        #         )

        #         user_subscription.subscription_id = subscription.id
        #         user_subscription.stripe_customer_id = customer
        #         user_subscription.price_id = subscription["items"].data[0].price.id
        #         user_subscription.unit_amount = (
        #             subscription["items"].data[0].price.unit_amount
        #         )
        #         user_subscription.latest_invoice_id = subscription.latest_invoice.id
        #         user_subscription.client_secret = (
        #             subscription.latest_invoice.payment_intent.client_secret
        #         )
        #         user_subscription.save()

        #         return Response(
        #             status=status.HTTP_200_OK,
        #             data=ResponseInfo().format_response(
        #                 data={
        #                     "subscriptionId": subscription.id,
        #                     "clientSecret": subscription.latest_invoice.payment_intent.client_secret,
        #                 },
        #                 status_code=status.HTTP_200_OK,
        #                 message="Subscription Created",
        #             ),
        #         )

    @action(detail=False, url_path="my-subscriptions", methods=["get"])
    def my_subscriptions(self, request, *args, **kwargs):
        data = []
        if request.user.user_company.stripe_customer_id:
            subscriptions = self.stripe_service.list_subscriptions_all(
                request.user.user_company.stripe_customer_id
            )
            if subscriptions:
                for i in subscriptions:
                    if i.status == "active" or i.status == "canceled":
                        if i.created:
                            created_date = datetime.datetime.utcfromtimestamp(
                                i.created
                            ).strftime("%Y-%m-%d %H:%M:%S UTC")
                        else:
                            created_date = None
                        if i.cancel_at:
                            cancel_date = datetime.datetime.utcfromtimestamp(
                                i.cancel_at
                            ).strftime("%Y-%m-%d %H:%M:%S UTC")
                        else:
                            cancel_date = None
                        amount = i["items"].data[0].price.unit_amount / 100
                        if i.current_period_end:
                            next_payment_date = datetime.datetime.utcfromtimestamp(
                                i.current_period_end
                            ).strftime("%Y-%m-%d %H:%M:%S UTC")
                        else:
                            next_payment_date = None

                        product = self.stripe_service.retrieve_product(
                            i["items"].data[0].price.product
                        )

                        dic = {
                            "subscription_id": i.id,
                            "amount": amount,
                            "next_payment": next_payment_date,
                            "price_id": i["items"].data[0].price.id,
                            "interval": i["items"].data[0].price.recurring.interval,
                            "interval_count": i["items"]
                            .data[0]
                            .price.recurring.interval_count,
                            "cancel_at_period_end": i.cancel_at_period_end,
                            "cancel_date": cancel_date,
                            "status": i.status,
                            "name": product.name,
                            "allowed_ads": product.metadata.allowed_ads,
                            "created_at": created_date,
                        }
                        data.append(dic)
                # return Response(
                #     status=status.HTTP_200_OK,
                #     data=ResponseInfo().format_response(
                #         data=data,
                #         status_code=status.HTTP_200_OK,
                #         message="My subscriptions",
                #     ),
                # )
            # return Response(
            #     status=status.HTTP_200_OK,
            #     data=ResponseInfo().format_response(
            #         data=None,
            #         status_code=status.HTTP_200_OK,
            #         message="My subscriptions",
            #     ),
            # )
        free_type = SubscriptionType.objects.filter(
            type=SUBSCRIPTION_TYPES["FREE"]
        ).first()
        if Subscription.objects.filter(
            company=request.user.user_company, type=free_type
        ).exists():
            free_plan = {
                "subscription_id": None,
                "amount": 0.0,
                "next_payment": None,
                "price_id": None,
                "interval": "month",
                "interval_count": 3,
                "cancel_at_period_end": False,
                "cancel_date": None,
                "status": "active",
                "name": "Free",
                "allowed_ads": "1",
                "created_at": "2023-09-26 14:22:35 UTC",
            }

            data.append(free_plan)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="My subscriptions",
            ),
        )

    @action(detail=False, url_path="current-subscription", methods=["get"])
    def current_subscription(self, request, *args, **kwargs):
        if Subscription.objects.filter(
            company__user__email=request.user.email,
            status=SUBSCRIPTION_STATUS["ACTIVE"],
        ).exists():
            my_subscriptions = Subscription.objects.filter(
                company__user__email=request.user.email,
                status=SUBSCRIPTION_STATUS["ACTIVE"],
            ).first()
            serializer = self.get_serializer(my_subscriptions).data

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=serializer,
                    status_code=status.HTTP_200_OK,
                    message="Current subscription",
                ),
            )
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "current_subscription": None,
                },
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
            retrieve_subscription = self.stripe.Subscription.retrieve(
                data_object["subscription"],
            )
            retrieve_product = self.stripe_service.retrieve_product(
                retrieve_subscription["items"].data[0].price.product
            )
            company = Company.objects.filter(
                stripe_customer_id=data_object.customer
            ).first()

            if retrieve_subscription.status == "active":
                if int(retrieve_product.metadata.allowed_ads) == 1:
                    updated_type = SUBSCRIPTION_TYPES["STANDARD"]
                elif int(retrieve_product.metadata.allowed_ads) == 2:
                    updated_type = SUBSCRIPTION_TYPES["ADVANCED"]
                if int(retrieve_product.metadata.allowed_ads) == 3:
                    updated_type = SUBSCRIPTION_TYPES["FEATURED"]
                updated_type = SubscriptionType.objects.filter(
                    type=updated_type
                ).first()

                if Subscription.objects.filter(company=company).exists():
                    subscription = Subscription.objects.filter(company=company).first()
                    subscription.subscription_id = retrieve_subscription.id
                    subscription.stripe_customer_id = data_object.customer
                    subscription.status = SUBSCRIPTION_STATUS["ACTIVE"]
                    subscription.type = updated_type
                    subscription.price_id = (
                        retrieve_subscription["items"].data[0].price.id
                    )
                    subscription.unit_amount = (
                        retrieve_subscription["items"].data[0].price.unit_amount
                    )
                    subscription.save()
                else:
                    Subscription.objects.create(
                        company=company,
                        subscription_id=retrieve_subscription.id,
                        stripe_customer_id=data_object.customer,
                        status=SUBSCRIPTION_STATUS["ACTIVE"],
                        type=updated_type,
                        unit_amount=(
                            retrieve_subscription["items"].data[0].price.unit_amount
                        ),
                        price_id=retrieve_subscription["items"].data[0].price.id,
                    )

        if event_type == "invoice.payment_failed":
            # If the payment fails or the customer does not have a valid payment method,
            # an invoice.payment_failed event is sent, the subscription becomes past_due.
            # Use this webhook to notify your user that their payment has
            # failed and to retrieve new card details.
            print(data_object)
        if event_type == "customer.updated":
            company = Company.objects.filter(
                stripe_customer_id=data_object.customer
            ).first()

            if PaymentMethod.objects.filter(company=company).exists():
                payment_method = PaymentMethod.objects.filter(company=company).first()
                if (
                    not payment_method.payment_method_id
                    == data_object.invoice_settings.default_payment_method
                ):
                    retrieve_payment_method = self.stripe.PaymentMethod.retrieve(
                        data_object.invoice_settings.default_payment_method
                    )
                    payment_method.payment_method_id = retrieve_payment_method.id
                    payment_method.brand = data_object.card.brand
                    payment_method.last_4 = data_object.card.last4
                    payment_method.save()

            PaymentMethod.objects.create(
                company=company,
                payment_method_id=data_object.id,
                brand=data_object.card.brand,
                last_4=data_object.card.last4,
            )

        if event_type == "payment_method.attached":
            company = Company.objects.filter(
                stripe_customer_id=data_object.customer
            ).first()
            if PaymentMethod.objects.filter(company=company).exists():
                PaymentMethod.objects.filter(company=company).update(
                    payment_method_id=data_object.id,
                    brand=data_object.card.brand,
                    last_4=data_object.card.last4,
                )
            else:
                PaymentMethod.objects.create(
                    company=company,
                    payment_method_id=data_object.id,
                    brand=data_object.card.brand,
                    last_4=data_object.card.last4,
                )

            print(data_object)

        if event_type == "checkout.session.completed":
            session_id = data_object.id
            session = self.stripe.checkout.Session.retrieve(session_id)
            setup_intent_id = session.setup_intent
            setup_intent = self.stripe.SetupIntent.retrieve(setup_intent_id)
            customer_id = setup_intent.customer
            subscription_id = setup_intent.metadata.subscription_id
            payment_method_id = setup_intent.payment_method
            self.stripe.Customer.modify(
                customer_id,
                invoice_settings={"default_payment_method": payment_method_id},
            )
            self.stripe.Subscription.modify(
                subscription_id,
                default_payment_method=payment_method_id,
            )

        if event_type == "customer.subscription.updated":
            if Subscription.objects.filter(subscription_id=data_object.id).exists():
                if data_object.status == "canceled":
                    Subscription.objects.filter(subscription_id=data_object.id).delete()

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

        if int(retrieve_old_product.metadata.allowed_ads) > allowed_ads:
            vendor_ads = Ad.objects.filter(company=request.user.user_company).count()

            if vendor_ads > allowed_ads:
                return Response(
                    status=status.HTTP_200_OK,
                    data=ResponseInfo().format_response(
                        data={"updated": False},
                        status_code=status.HTTP_200_OK,
                        message=f"You can't upgrade to this plan. Your Current Active Ad count is {vendor_ads}, while the plan you want to upgrade allow {allowed_ads} ads upload. Please delete your unwanted ads first.",
                    ),
                )

        update_subscription = self.stripe_service.update_subscription(
            subscription_id, retrieve_subscription["items"].data[0].id, price_id
        )

        if update_subscription:
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"updated": True},
                    status_code=status.HTTP_200_OK,
                    message="Your Subscription will be changed after invoice has been paid successfully",
                ),
            )

    @action(detail=False, url_path="cancel-subscription", methods=["post"])
    def cancel_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription_id = serializer.validated_data.pop("subscription_id")
        cancel_subscription = self.stripe_service.cancel_subscription(subscription_id)

        if cancel_subscription:
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"cancelled": True},
                    status_code=status.HTTP_200_OK,
                    message="Subscription Will be cancelled at the end of current billing cycle",
                ),
            )
        else:
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"cancelled": False},
                    status_code=status.HTTP_200_OK,
                    message="There are some errors",
                ),
            )

    @action(detail=False, url_path="resume-subscription", methods=["post"])
    def resume_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription_id = serializer.validated_data.pop("subscription_id")

        resume_subscription = self.stripe_service.resume_subscription(subscription_id)

        if resume_subscription:
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"resumed": True},
                    status_code=status.HTTP_200_OK,
                    message="Subscription is resumed",
                ),
            )
        else:
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={"resumed": False},
                    status_code=status.HTTP_200_OK,
                    message="Try again, there are some error",
                ),
            )

    @action(detail=False, url_path="update-payment-method", methods=["get"])
    def update_payment_method(self, request, *args, **kwargs):
        subscription = Subscription.objects.filter(
            company=request.user.user_company, subscription_id__isnull=False
        ).first()
        session = None

        if subscription:
            session = self.stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="setup",
                customer=subscription.stripe_customer_id,
                setup_intent_data={
                    "metadata": {
                        "subscription_id": subscription.subscription_id,
                    },
                },
                success_url="https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url="https://example.com/cancel",
            )

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=session,
                status_code=status.HTTP_200_OK,
                message="Checkout session",
            ),
        )

    @action(detail=False, url_path="get-payment-method", methods=["get"])
    def get_payment_method(self, request, *args, **kwargs):
        payment_method = PaymentMethod.objects.filter(
            company=request.user.user_company
        ).first()
        data = self.get_serializer(payment_method).data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Payment method",
            ),
        )
