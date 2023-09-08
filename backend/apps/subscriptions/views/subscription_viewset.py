

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
from apps.subscriptions.serializers.create_serializer import CreateCustomerSerializer, InputPriceIdSerializer

from apps.subscriptions.serializers.get_serializer import TestSerializer
from apps.subscriptions.stripe_service import StripeService
from apps.utils.constants import PRODUCT_NAMES

from apps.utils.views.base import BaseViewset, ResponseInfo


class SubscriptionsViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = Subscription.objects.all()
    action_serializers = {
        "default":TestSerializer,
        "create_subscription":CreateCustomerSerializer,
        "product_subscription_list":InputPriceIdSerializer
        
    }
    action_permissions = {
        "default":[],
        "create_subscription":[IsAuthenticated, IsVendorUser],
        "subscription_success":[IsAuthenticated, IsVendorUser]
      
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
                         'currency':price_data[product.default_price]['currency'],
                         'price_id':price_data[product.default_price]['id']})


        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Products List"
            ),
        )

    @action(detail=False, url_path="checkout", methods=["post"])
    def create_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        price_id=serializer.validated_data.pop("price_id")
        
        domain_url = 'http://localhost:8000/'
        sub=Subscription.objects.filter(company__user__email=request.user.email).first()
        
        if sub and sub.stripe_customer_id:
           customer=sub.stripe_customer_id
        else:
            customer=stripe.Customer.create(email=request.user.email).id
            company=Company.objects.filter(user__email=request.user.email).first()
            Subscription.objects.create(stripe_customer_id=customer,
                                        company=company
                                        )


        checkout_session = self.stripe_service.create_session(
                customer,
                price_id,
                domain_url,
            )
       
        print('customer',checkout_session)
        # data={
        #   'url':checkout_session['url']
        # }
    

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=checkout_session['url'], status_code=status.HTTP_200_OK, message="Products List"
            ),
        )
    
    @action(detail=False, url_path="success", methods=["get"])
    def subscription_success(self, request, *args, **kwargs):

        sub=Subscription.objects.filter(company__user__email=request.user.email).first()
        data=[]
        if sub and sub.stripe_customer_id:
            subscriptions = stripe.Subscription.list(
                customer=sub.stripe_customer_id)
            
            sub.extras['plan']=subscriptions.data[0]['plan']
            product=stripe.Product.retrieve(
                id=subscriptions.data[0]['plan']['product']
            )
            product_name=product.name.lower()
            print(product_name)
            if product_name in PRODUCT_NAMES.keys():
               sub.type=PRODUCT_NAMES[product_name]
            sub.save()
            data=subscriptions['data']

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

    