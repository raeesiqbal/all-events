# Imports
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.subscriptions.stripe_service import StripeService, WebHookService
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework import status
import datetime
from apps.utils.tasks import (
    delete_s3_object_by_url_list,
)

# Permissions
from apps.users.permissions import IsVendorUser, IsVerified

# Constants
from apps.subscriptions.constants import SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES
from apps.ads.models import Gallery

# Models
from apps.subscriptions.models import (
    Subscription,
    SubscriptionType,
    PaymentMethod,
)
from apps.ads.models import Ad, FAQ
from apps.companies.models import Company
from apps.analytics.models import AdReview, Calender

# Serializers
from apps.subscriptions.serializers.create_serializer import (
    CreateCustomerSerializer,
    InputPriceIdSerializer,
)
from apps.subscriptions.serializers.get_serializer import (
    TestSerializer,
    CurrentSubscriptionSerializer,
    GetPaymentMethodSerializer,
    MySubscriptionSerializer,
    SubscriptionValidateSerializer,
)
from apps.subscriptions.serializers.update_serializer import (
    SubscriptionUpdateSerializer,
)


class SubscriptionsViewSet(BaseViewset):
    """
    API endpoints that manages user subscriptions
    """

    queryset = Subscription.objects.all()
    action_serializers = {
        "default": TestSerializer,
        "create_subscription": CreateCustomerSerializer,
        "update_subscription": SubscriptionUpdateSerializer,
        "product_subscription_list": InputPriceIdSerializer,
        "current_subscription": CurrentSubscriptionSerializer,
        "get_payment_method": GetPaymentMethodSerializer,
        "my_subscriptions": MySubscriptionSerializer,
        "validate_update_subscription": SubscriptionValidateSerializer,
    }
    action_permissions = {
        "default": [],
        "create_subscription": [IsAuthenticated, IsVerified, IsVendorUser],
        "update_subscription": [IsAuthenticated, IsVerified, IsVendorUser],
        "cancel_subscription": [IsAuthenticated, IsVerified, IsVendorUser],
        "resume_subscription": [IsAuthenticated, IsVerified, IsVendorUser],
        "my_subscriptions": [IsAuthenticated, IsVendorUser],
        "current_subscription": [IsAuthenticated, IsVendorUser],
        "update_payment_method": [IsAuthenticated, IsVerified, IsVendorUser],
        "get_payment_method": [IsAuthenticated, IsVendorUser],
        "download_invoice": [IsAuthenticated, IsVerified, IsVendorUser],
        "validate_update_subscription": [IsAuthenticated, IsVerified, IsVendorUser],
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
                Subscription.objects.filter(
                    company__user__email=request.user.email,
                    status__in=["active", "unpaid"],
                )
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
        price_id = serializer.validated_data.get("price_id")
        allowed_ads = serializer.validated_data.pop("allowed_ads")
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

        if Ad.objects.filter(company=company).exists():
            ads = Ad.objects.filter(company=company).count()
            if ads > allowed_ads:
                return Response(
                    status=status.HTTP_200_OK,
                    data=ResponseInfo().format_response(
                        data={
                            "subscribed": False,
                            "subscriptionId": None,
                            "clientSecret": None,
                        },
                        status_code=status.HTTP_200_OK,
                        message=f"You can't subscribe to this plan. Your Current Ad count is {ads}, while the plan you want to subscribe allow {allowed_ads} ads. Please delete your unwanted ads first.",
                    ),
                )
        subscription = self.stripe_service.create_subscription(customer, price_id)
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={
                    "subscribed": True,
                    "subscriptionId": subscription.id,
                    "clientSecret": subscription.latest_invoice.payment_intent.client_secret,
                },
                status_code=status.HTTP_200_OK,
                message="Subscription is created with incomplete status",
            ),
        )

    @action(detail=False, url_path="my-subscriptions", methods=["get"])
    def my_subscriptions(self, request, *args, **kwargs):
        my_subscriptions = Subscription.objects.filter(
            company__user__email=request.user.email,
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

    @action(detail=False, url_path="current-subscription", methods=["get"])
    def current_subscription(self, request, *args, **kwargs):
        if Subscription.objects.filter(
            company__user__email=request.user.email, status__in=["active", "unpaid"]
        ).exists():
            my_subscription = Subscription.objects.filter(
                company__user__email=request.user.email, status__in=["active", "unpaid"]
            ).first()
            serializer = self.get_serializer(my_subscription).data

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
                data=None,
                status_code=status.HTTP_200_OK,
                message="My subscriptions",
            ),
        )

    @action(detail=False, url_path="webhook", methods=["post"])
    def webhook(self, request, *args, **kwargs):
        payload = request.body.decode("utf-8")

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
                elif int(retrieve_product.metadata.allowed_ads) == 3:
                    updated_type = SUBSCRIPTION_TYPES["FEATURED"]
                updated_type = SubscriptionType.objects.filter(
                    type=updated_type
                ).first()

                if Subscription.objects.filter(
                    company=company, status__in=["active", "unpaid"]
                ).exists():
                    subscription = Subscription.objects.filter(
                        company=company, status__in=["active", "unpaid"]
                    ).first()
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
                    subscription.stripe_subscription = retrieve_subscription
                    subscription.stripe_product = retrieve_product
                    subscription.save()

                else:
                    subscription = Subscription.objects.create(
                        company=company,
                        subscription_id=retrieve_subscription.id,
                        stripe_customer_id=data_object.customer,
                        status=SUBSCRIPTION_STATUS["ACTIVE"],
                        type=updated_type,
                        unit_amount=(
                            retrieve_subscription["items"].data[0].price.unit_amount
                        ),
                        price_id=retrieve_subscription["items"].data[0].price.id,
                        stripe_subscription=retrieve_subscription,
                        stripe_product=retrieve_product,
                    )
            if Ad.objects.filter(company=company, status="inactive").exists():
                Ad.objects.filter(company=company).update(status="active")

        if event_type == "invoice.payment_failed":
            pass
        if event_type == "customer.updated":
            pass

        if event_type == "payment_method.attached":
            company = Company.objects.filter(
                stripe_customer_id=data_object.customer
            ).first()
            if PaymentMethod.objects.filter(company=company).exists():
                PaymentMethod.objects.filter(company=company).update(
                    payment_method_id=data_object.id,
                    brand=data_object.card.brand,
                    last_4=data_object.card.last4,
                    exp_month=data_object.card.exp_month,
                    exp_year=data_object.card.exp_year,
                )
            else:
                PaymentMethod.objects.create(
                    company=company,
                    payment_method_id=data_object.id,
                    brand=data_object.card.brand,
                    last_4=data_object.card.last4,
                    exp_month=data_object.card.exp_month,
                    exp_year=data_object.card.exp_year,
                )

        if event_type == "checkout.session.completed":
            if data_object.mode == "setup":
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

                retrieve_subscription = self.stripe_service.retrieve_subscription(
                    subscription_id=subscription_id
                )
                if retrieve_subscription.status == "unpaid":
                    latest_invoice = self.stripe_service.retrieve_invoice(
                        retrieve_subscription.latest_invoice
                    )
                    if latest_invoice.status == "draft":
                        self.stripe.Invoice.modify(
                            latest_invoice.id,
                            auto_advance=True,
                        )
                        self.stripe.Invoice.finalize_invoice(
                            latest_invoice.id,
                        )
                    self.stripe.Invoice.pay(latest_invoice.id)
            else:
                pass

        if event_type == "customer.subscription.updated":
            if Subscription.objects.filter(subscription_id=data_object.id).exists():
                subscription = Subscription.objects.filter(
                    subscription_id=data_object.id
                ).first()
                subscription.stripe_subscription = data_object
                if data_object.status == "unpaid":
                    subscription.status = "unpaid"
                    if Ad.objects.filter(company=subscription.company).exists():
                        Ad.objects.filter(company=subscription.company).update(
                            status="inactive"
                        )
                elif data_object.status == "active":
                    subscription.status = "active"
                    if Ad.objects.filter(company=subscription.company).exists():
                        Ad.objects.filter(company=subscription.company).update(
                            status="active"
                        )
                subscription.save()
        if event_type == "customer.subscription.deleted":
            if Subscription.objects.filter(subscription_id=data_object.id).exists():
                subscription = Subscription.objects.filter(
                    subscription_id=data_object.id
                ).first()
                subscription.status = "cancelled"
                subscription.stripe_subscription = data_object
                subscription.save()
                if Ad.objects.filter(company=subscription.company).exists():
                    Ad.objects.filter(company=subscription.company).update(
                        status="inactive"
                    )
                payment_method = PaymentMethod.objects.filter(
                    company=subscription.company
                ).first()
                if payment_method:
                    self.stripe.PaymentMethod.detach(payment_method.payment_method_id)
                    payment_method.delete()

        return Response({"message": "Webhook received successfully"})

    @action(detail=False, url_path="validate-update-subscription", methods=["post"])
    def validate_update_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        allowed_ads = serializer.validated_data.pop("allowed_ads")
        old_subscription = Subscription.objects.filter(
            company=request.user.user_company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        if old_subscription:
            consent_list = []
            if allowed_ads == 1:
                updated_type = SUBSCRIPTION_TYPES["STANDARD"]
            elif allowed_ads == 2:
                updated_type = SUBSCRIPTION_TYPES["ADVANCED"]
            elif allowed_ads == 3:
                updated_type = SUBSCRIPTION_TYPES["FEATURED"]
            updated_type = SubscriptionType.objects.filter(type=updated_type).first()
            if old_subscription.type.reviews == True and updated_type.reviews == False:
                consent_list.append("Ads reviews will be deleted if any")
            if (
                old_subscription.type.calender == True
                and updated_type.calender == False
            ):
                consent_list.append("Ads calendars will be disabled")
            if old_subscription.type.faq == True and updated_type.faq == False:
                consent_list.append("Ads FAQ'S will be deleted if any")
            if (
                old_subscription.type.offered_services == True
                and updated_type.offered_services == False
            ):
                consent_list.append("Ads offered services will be deleted if any")
            if (
                old_subscription.type.analytics == True
                and updated_type.analytics == False
            ):
                consent_list.append("Ads analytics will be disabled")
            if (
                old_subscription.type.pdf_upload == True
                and updated_type.pdf_upload == False
            ):
                consent_list.append("Ads pdf's will be deleted if any")
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=consent_list,
                    status_code=status.HTTP_200_OK,
                    message="Consent information",
                ),
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Action not allowed",
            ),
        )

    @action(detail=False, url_path="update-subscription", methods=["post"])
    def update_subscription(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        price_id = serializer.validated_data.pop("price_id")
        allowed_ads = serializer.validated_data.pop("allowed_ads")
        old_subscription = Subscription.objects.filter(
            company=request.user.user_company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        if old_subscription:
            vendor_ads = Ad.objects.filter(company=request.user.user_company)
            vendor_ads_count = Ad.objects.filter(
                company=request.user.user_company
            ).count()
            if allowed_ads == 1:
                updated_type = SUBSCRIPTION_TYPES["STANDARD"]
            elif allowed_ads == 2:
                updated_type = SUBSCRIPTION_TYPES["ADVANCED"]
            elif allowed_ads == 3:
                updated_type = SUBSCRIPTION_TYPES["FEATURED"]
            updated_type = SubscriptionType.objects.filter(type=updated_type).first()
            if (
                int(old_subscription.stripe_product["metadata"]["allowed_ads"])
                > allowed_ads
            ):
                error_list = []
                if vendor_ads_count > 0:
                    if vendor_ads_count > updated_type.allowed_ads:
                        error_list.append(
                            f"Please delete excess ads ({vendor_ads_count}) before downgrading. The new plan only allows ({allowed_ads})."
                        )
                    for ad in vendor_ads:
                        gallery = Gallery.objects.filter(ad=ad).first()
                        if gallery:
                            image_count = len(gallery.media_urls["images"])
                            video_count = len(gallery.media_urls["video"])
                            if image_count > updated_type.allowed_ad_photos:
                                error_list.append(
                                    f"Your ad {ad.name} has ({image_count}) images, but the selected plan allows only ({updated_type.allowed_ad_photos}) images."
                                )
                            if video_count > updated_type.allowed_ad_videos:
                                error_list.append(
                                    f"Your ad {ad.name} has ({video_count}) videos, but the selected plan allows only ({updated_type.allowed_ad_videos})."
                                )
                    if error_list:
                        return Response(
                            status=status.HTTP_400_BAD_REQUEST,
                            data=ResponseInfo().format_response(
                                data=error_list,
                                status_code=status.HTTP_400_BAD_REQUEST,
                                message="Please remove below errors in order to downgrade.",
                            ),
                        )
            update_subscription = self.stripe_service.update_subscription(
                old_subscription.subscription_id,
                old_subscription.stripe_subscription["items"]["data"][0]["id"],
                price_id,
            )
        status_code = status.HTTP_400_BAD_REQUEST
        message = "An error occur while updating your subscription, please try again."

        if update_subscription:
            for ad in vendor_ads:
                if not updated_type.reviews:
                    AdReview.objects.filter(ad=ad).delete()
                if not updated_type.offered_services:
                    FAQ.objects.filter(ad=ad).delete()
                if not updated_type.offered_services:
                    ad.offered_services = None
                    ad.save()
                if not updated_type.calender:
                    Calender.objects.filter(ad=ad).delete()
                gallery = Gallery.objects.filter(ad=ad).first()
                if not updated_type.pdf_upload and gallery:
                    pdfs = gallery.media_urls["pdf"]
                    delete_s3_object_by_url_list.delay(pdfs)
                    gallery.media_urls["pdf"] = []
                    gallery.save()
            status_code = status.HTTP_200_OK
            message = "Your subscription will be updated after the invoice has been paid successfully"

        return Response(
            status=status_code,
            data=ResponseInfo().format_response(
                data=None,
                status_code=status_code,
                message=message,
            ),
        )

    @action(detail=False, url_path="cancel-subscription", methods=["patch"])
    def cancel_subscription(self, request, *args, **kwargs):
        subscription = Subscription.objects.filter(
            company=request.user.user_company,
            status__in=[SUBSCRIPTION_STATUS["ACTIVE"], SUBSCRIPTION_STATUS["UNPAID"]],
        ).first()
        status_code = status.HTTP_400_BAD_REQUEST
        message = "There is no active/unapid subscription"
        if subscription:
            message = (
                "An error occur while cancelling your subscription, please try again."
            )
            cancel_subscription = self.stripe_service.cancel_subscription(
                subscription.subscription_id
            )
            if cancel_subscription:
                status_code = status.HTTP_200_OK
                message = (
                    "Subscription will be cancelled at the end of current billing cycle"
                )
        return Response(
            status=status_code,
            data=ResponseInfo().format_response(
                data={},
                status_code=status_code,
                message=message,
            ),
        )

    @action(detail=False, url_path="resume-subscription", methods=["patch"])
    def resume_subscription(self, request, *args, **kwargs):
        subscription = Subscription.objects.filter(
            company=request.user.user_company, status=SUBSCRIPTION_STATUS["ACTIVE"]
        ).first()
        status_code = status.HTTP_400_BAD_REQUEST
        message = "There is no active subscription"
        if subscription:
            resume_subscription = self.stripe_service.resume_subscription(
                subscription.subscription_id
            )
            message = (
                "An error occured while resuming your subscription, please try again."
            )
            if resume_subscription:
                status_code = status.HTTP_200_OK
                message = "Subscription has been resumed successfully."
        return Response(
            status=status_code,
            data=ResponseInfo().format_response(
                data={},
                status_code=status_code,
                message=message,
            ),
        )

    @action(detail=False, url_path="update-payment-method", methods=["get"])
    def update_payment_method(self, request, *args, **kwargs):
        subscription = Subscription.objects.filter(
            company=request.user.user_company,
            status__in=[SUBSCRIPTION_STATUS["ACTIVE"], SUBSCRIPTION_STATUS["UNPAID"]],
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
                success_url="http://localhost:5173/dashboard?",
                cancel_url="http://localhost:5173/dashboard",
            )
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=session,
                    status_code=status.HTTP_200_OK,
                    message="Checkout session",
                ),
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="You don't have any active or unpaid subscription",
            ),
        )

    @action(detail=False, url_path="get-payment-method", methods=["get"])
    def get_payment_method(self, request, *args, **kwargs):
        payment_method = PaymentMethod.objects.filter(
            company=request.user.user_company
        ).first()
        if payment_method:
            data = self.get_serializer(payment_method).data
        else:
            data = None
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Payment method",
            ),
        )

    @action(detail=True, url_path="list-invoice", methods=["get"])
    def list_invoice(self, request, *args, **kwargs):
        subscription = Subscription.objects.filter(id=kwargs["pk"]).first()
        if subscription.company.user == request.user:
            invoices = self.stripe.Invoice.list(
                subscription=subscription.subscription_id
            )
            invoices_data = [
                {
                    "id": invoice.id,
                    "status": invoice.status,
                    "amount_due": invoice.amount_due,
                    "amount_paid": invoice.amount_paid,
                    "invoice_pdf": invoice.invoice_pdf,
                    "created": datetime.datetime.fromtimestamp(
                        invoice.created
                    ).strftime("%d/%m/%Y"),
                }
                for invoice in invoices.auto_paging_iter()
            ]
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=invoices_data,
                    status_code=status.HTTP_200_OK,
                    message="Subscription invoices",
                ),
            )
        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data=ResponseInfo().format_response(
                data=None,
                status_code=status.HTTP_403_FORBIDDEN,
                message="Forbidden action",
            ),
        )
