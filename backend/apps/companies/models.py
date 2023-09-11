from django.db import models
from apps.ads.models import Country
from apps.subscriptions.models import Subscription
from apps.utils.constants import SUBSCRIPTION_TYPES
from apps.utils.models.base import NewAbstractModel
from apps.users.models import User
from django.utils.translation import gettext_lazy as _
from django.db.models import DateTimeField
from django.utils import timezone


class Company(NewAbstractModel):
    """
    Company model containing the company's details.
    """

    name = models.TextField(verbose_name=_("Denumire Firma"))
    is_active = models.BooleanField(default=True)
    postal_code = models.TextField(null=True, blank=True, verbose_name=_("Cod Postal"))
    fiscal_code = models.TextField(null=True, blank=True, verbose_name=_("Cod Fiscal"))
    address = models.TextField(null=True, blank=True, verbose_name=_("adresa"))
    firm_number = models.TextField(
        null=True, blank=True, verbose_name=_("Nr. Reg. Comertului")
    )
    bank_name = models.TextField(null=True, blank=True, verbose_name=_("Banca"))
    bank_iban = models.TextField(null=True, blank=True, verbose_name=_("IBAN"))
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_company"
    )
    country = models.ForeignKey(
        Country,
        verbose_name=_("Judet"),
        on_delete=models.CASCADE,
        related_name="country_companies",
        null=True,
        blank=True,
    )
    image = models.TextField(null=True, blank=True)
    city = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        super(Company, self).save(*args, **kwargs)
        if not Subscription.objects.filter(company=self).exists():
            Subscription.objects.create(
                company=self, type=SUBSCRIPTION_TYPES["FEATURED"]
            )

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"
