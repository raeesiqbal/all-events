from datetime import datetime
from django.conf import settings
import stripe


class StripeService:

    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        self.stripe = stripe

    def get_stripe(self):
        return self.stripe
    
    def list_products(self):
        return stripe.Product.list()
    
    def retrieve_product_price(self,default_price):
        return stripe.Price.retrieve(default_price)

    def create_account(self, email, acc_type):
        try:
            response = stripe.Account.create(
                type=acc_type,
                email=email,
                capabilities={
                    "card_payments": {"requested": True},
                    "transfers": {"requested": True}
                },
            )

            return response['id']
        except Exception as ex:
            return None

    