

from django.conf import settings
import stripe

from rest_framework.response import Response
from rest_framework import status
from apps.clients.models import Client
from rest_framework.decorators import action

from apps.subscriptions.serializers.get_serializer import TestSerializer
from apps.subscriptions.stripe_service import StripeService

from apps.utils.views.base import BaseViewset, ResponseInfo


class SubscriptionsViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = Client.objects.all()
    action_serializers = {
        "default":TestSerializer
        
    }
    action_permissions = {
        "default":[]
      
    }
    stripe_service=StripeService()

    @action(detail=False, url_path="products", methods=["get"])
    def public_products(self, request, *args, **kwargs):
        data=[]

        products=self.stripe_service.list_products()
        price_data = {}

        for product in products.data:
            price = self.stripe_service.retrieve_product_price(product.default_price)
            price_data[product.default_price]=price
        
        for product in products.data:
            data.append({'id':product.id,
                         'object':product.object,'description':product.description,
                         'images':product.images,'recurring':price_data[product.default_price]['recurring'],
                         'unit_price':price_data[product.default_price]['unit_amount']/100,
                         'currency':price_data[product.default_price]['currency']})


        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Products List"
            ),
        )

    @action(detail=False, url_path="payment-method", methods=["get"])
    def create_payment_method(self, request, *args, **kwargs):
        data=[]
        print(self.stripe_service.create_payment_method())
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Products List"
            ),
        )
    

