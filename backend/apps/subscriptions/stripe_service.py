from datetime import datetime
from django.conf import settings
import stripe
from apps.subscriptions.models import Subscription


class WebHookService:
    def clear_subscription_model(self, subscription_id):
        subscription = Subscription.objects.filter(
            subscription_id=subscription_id
        ).first()
        subscription.subscription_id = None
        subscription.stripe_customer_id = None
        subscription.canceled_at = None
        subscription.price_id = None
        subscription.unit_amount = None
        subscription.latest_invoice_id = None
        subscription.client_secret = None
        subscription.save()
        return True

    def update_subscription(
        user_email,
        subscription_id,
        stripe_customer_id,
        price_id,
        unit_amount,
        latest_invoice_id,
        client_secret,
    ):
        Subscription.objects.filter(company__user__email=user_email).update(
            subscription_id=subscription_id,
            stripe_customer_id=stripe_customer_id,
            price_id=price_id,
            unit_amount=unit_amount,
            latest_invoice_id=latest_invoice_id,
            client_secret=client_secret,
        )


class StripeService:
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        self.stripe = stripe

    def get_stripe(self):
        return self.stripe

    def retrieve_product(self, product_id):
        return stripe.Product.retrieve(product_id)

    def list_products(self):
        return stripe.Product.list(
            active=True,
            created={"gt": 1694325549},
        )

    def retrieve_product_price(self, default_price):
        return stripe.Price.retrieve(default_price)

    def retrieve_subscription(self, subscription_id):
        return stripe.Subscription.retrieve(subscription_id)

    def create_account(self, email, acc_type):
        try:
            response = stripe.Account.create(
                type=acc_type,
                email=email,
                capabilities={
                    "card_payments": {"requested": True},
                    "transfers": {"requested": True},
                },
            )

            return response["id"]
        except Exception as ex:
            return None

    def create_payment_method(self):
        try:
            payment_method = stripe.PaymentMethod.create(
                type="card",
                card={
                    "number": "4242424242424242",
                    "exp_month": 12,
                    "exp_year": 2023,
                    "cvc": "123",
                },
            )
            return payment_method
        except Exception as ex:
            return None

    def create_session(self, customer_id, price_id, domain_url):
        try:
            checkout_session = stripe.checkout.Session.create(
                customer=customer_id,
                success_url=domain_url + "success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=domain_url + "cancel/",
                payment_method_types=["card"],
                mode="subscription",
                line_items=[
                    {
                        "price": price_id,
                        "quantity": 1,
                    }
                ],
            )
            return checkout_session
        except Exception as ex:
            return None

    def create_session(self, customer_id, price_id, domain_url):
        try:
            checkout_session = stripe.checkout.Session.create(
                customer=customer_id,
                success_url=domain_url + "success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=domain_url + "cancel/",
                payment_method_types=["card"],
                mode="subscription",
                line_items=[
                    {
                        "price": price_id,
                        "quantity": 1,
                    }
                ],
            )
            return checkout_session
        except Exception as ex:
            return None

    def create_subscription(self, customer_id, price_id):
        try:
            create_subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[
                    {
                        "price": price_id,
                    }
                ],
                payment_behavior="default_incomplete",
                payment_settings={"save_default_payment_method": "on_subscription"},
                expand=["latest_invoice.payment_intent"],
            )
            return create_subscription
        except Exception as ex:
            return None

    def update_subscription(self, subscription_id, item_id, price_id):
        try:
            updated_subscription = stripe.Subscription.modify(
                subscription_id,
                items=[
                    {
                        "id": item_id,
                        "deleted": True,
                    },
                    {
                        "price": price_id,
                    },
                ],
                proration_behavior="always_invoice",
            )
            return updated_subscription
        except Exception as ex:
            return None

    def cancel_subscription(self, subscription_id):
        try:
            cancel_subscription = stripe.Subscription.cancel(
                subscription_id,
            )
            return cancel_subscription
        except Exception as ex:
            return None
