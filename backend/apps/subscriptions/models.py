from django.db import models
from apps.subscriptions.constants import SUBSCRIPTION_TYPES, SUBSCRIPTION_STATUS
from apps.utils.models.base import NewAbstractModel
from django.utils.translation import gettext_lazy as _


class SubscriptionType(NewAbstractModel):
    SUBSCRIPTION_TYPES = (
        (SUBSCRIPTION_TYPES["FREE"], "free"),
        (SUBSCRIPTION_TYPES["STANDARD"], "standard"),
        (SUBSCRIPTION_TYPES["ADVANCED"], "advanced"),
        (SUBSCRIPTION_TYPES["FEATURED"], "featured"),
    )
    type = models.CharField(
        _("Type"), choices=SUBSCRIPTION_TYPES, max_length=50, unique=True
    )
    allowed_ads = models.IntegerField(_("Allowed Ads"))
    allowed_ad_photos = models.IntegerField(_("Allowed Ad Photos"))
    allowed_ad_videos = models.IntegerField(_("Allowed Ad Videos"))
    pdf_upload = models.BooleanField(_("Pdf Upload"))
    reviews = models.BooleanField(_("Reviews"))
    faq = models.BooleanField(_("FAQ"))
    offered_services = models.BooleanField(_("Offered Services"))
    analytics = models.BooleanField(_("Analytics"))
    calender = models.BooleanField(_("Calender"))

    class Meta:
        verbose_name = "Subscription Type"
        verbose_name_plural = "Subscription Types"

    def __str__(self):
        return f"{self.id}"


class Subscription(NewAbstractModel):
    SUBSCRIPTION_STATUS = (
        (SUBSCRIPTION_STATUS["ACTIVE"], "active"),
        (SUBSCRIPTION_STATUS["INACTIVE"], "inactive"),
        (SUBSCRIPTION_STATUS["CANCELLED"], "cancelled"),
        (SUBSCRIPTION_STATUS["UNPAID"], "unpaid"),
    )

    company = models.ForeignKey(
        "companies.Company", on_delete=models.CASCADE, related_name="my_subscriptions"
    )
    type = models.ForeignKey(
        "subscriptions.SubscriptionType",
        verbose_name=_("Type"),
        on_delete=models.CASCADE,
    )
    subscription_id = models.TextField(_("Subscription Id"), null=True, blank=True)
    stripe_customer_id = models.TextField(
        _("Stripe Customer Id"), null=True, blank=True
    )
    price_id = models.TextField(_("Price Id"), null=True, blank=True)
    unit_amount = models.TextField(_("Unit Amount"), null=True, blank=True)
    status = models.CharField(
        _("Status"), choices=SUBSCRIPTION_STATUS, max_length=50, null=True, blank=True
    )

    class Meta:
        verbose_name = "Subscription"
        verbose_name_plural = "Subscriptions"

    def __str__(self):
        return f"{self.id}"


class PaymentMethod(NewAbstractModel):
    company = models.OneToOneField(
        "companies.Company",
        verbose_name=_("Company"),
        on_delete=models.CASCADE,
        related_name="payment_method_company",
    )
    payment_method_id = models.TextField(_("Payment Method Id"))
    brand = models.TextField(_("Brand"))
    last_4 = models.TextField(_("Last 4"))
    exp_month = models.TextField(_("Expiry Month"), null=True, blank=True)
    exp_year = models.TextField(_("Expiry Year"), null=True, blank=True)

    class Meta:
        verbose_name = "PaymentMethod"
        verbose_name_plural = "PaymentMethods"

    def __str__(self):
        return f"{self.id}"
