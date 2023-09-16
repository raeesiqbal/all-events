from django.db import models
from apps.utils.constants import SUBSCRIPTION_TYPES
from apps.utils.models.base import NewAbstractModel
from django.utils.translation import gettext_lazy as _


class Subscription(NewAbstractModel):
    company = models.ForeignKey(
        "companies.Company", on_delete=models.CASCADE, related_name="my_subscriptions"
    )

    subscription_id = models.TextField(_("Subscription Id"))
    # customer
    stripe_customer_id = models.TextField(null=True, blank=True)
    # cancellation
    canceled_at = models.TextField(_("Canceled At"), null=True, blank=True)
    # price
    price_id = models.TextField(_("Plan Id"))
    unit_amount = models.TextField(_("Unit Amount"))
    # latest Invoice
    latest_invoice_id = models.TextField(_("Latest Invoice Id"))

    class Meta:
        verbose_name = "Subscription"
        verbose_name_plural = "Subscriptions"

    def __str__(self):
        return f"{self.id}"
