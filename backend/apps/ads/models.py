# imports
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField
from apps.utils.models.base import NewAbstractModel
from apps.utils.utils import unique_slugify


# constants
from apps.ads.constants import AD_STATUS


class Country(models.Model):
    name = models.TextField(_("Judet"), unique=True)
    image_url = models.TextField(_("Image url"), null=True, blank=True)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"


class Category(models.Model):
    name = models.TextField(_("Categorie"), unique=True)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class SubCategory(models.Model):
    category = models.ForeignKey(
        "ads.Category",
        verbose_name=_("Categorie"),
        on_delete=models.CASCADE,
        related_name="sub_categories",
    )
    name = models.TextField(_("Sub Categorie"))

    def __str__(self):
        return f"{self.name}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Sub Category"
        verbose_name_plural = "Sub Categories"


class Ad(NewAbstractModel):
    AD_STATUS = (
        (AD_STATUS["ACTIVE"], "active"),
        (AD_STATUS["INACTIVE"], "inactive"),
    )
    slug = models.SlugField(null=True, blank=True)
    name = models.CharField(default="Ad", verbose_name=_("Commercial Name"))
    description = models.TextField(_("Description"), null=True, blank=True)
    company = models.ForeignKey(
        "companies.Company", verbose_name=_("Company"), on_delete=models.CASCADE
    )
    sub_category = models.ForeignKey(
        "ads.SubCategory",
        on_delete=models.CASCADE,
        related_name="sub_category_ads",
        verbose_name=_("Sub Categorie"),
    )
    related_sub_categories = models.ForeignKey(
        "ads.SubCategory",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="related_sub_category_ads",
        verbose_name=_("Related Sub Categorie"),
    )
    activation_countries = models.ManyToManyField(
        "ads.Country",
        related_name="country_ads",
        verbose_name=_("Judete in care oferiti serviciile mentionate"),
        blank=True,
    )
    # contact information
    website = models.TextField(_("Website"), null=True, blank=True)
    country = models.ForeignKey(
        "ads.Country",
        verbose_name=_("Judet"),
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    city = models.TextField(_("Oras/Comuna"), null=True, blank=True)
    street = models.TextField(_("Strada"), null=True, blank=True)
    number = models.TextField(_("Numar"), null=True, blank=True)
    full_address = models.TextField(_("Adresa completa"), null=True, blank=True)
    # social media
    facebook = models.TextField(_("Facebook"), null=True, blank=True)
    instagram = models.TextField(_("Instagram"), null=True, blank=True)
    youtube = models.TextField(_("Youtube"), null=True, blank=True)
    tiktok = models.TextField(_("Tiktok"), null=True, blank=True)
    twitter = models.TextField(_("Twitter"), null=True, blank=True)
    others = models.TextField(_("Others"), null=True, blank=True)

    offered_services = ArrayField(base_field=models.TextField(), null=True, blank=True)
    site_services = ArrayField(base_field=models.TextField(), null=True, blank=True)

    total_views = models.IntegerField(_("Total Views"), default=0)
    status = models.CharField(
        _("Status"), choices=AD_STATUS, default="active", max_length=50
    )

    def __str__(self):
        return f"{self.name}"

    def save(self, *args, **kwargs):
        self.slug = unique_slugify(Ad, self.name, self.id)
        super(Ad, self).save(*args, **kwargs)

    class Meta:
        ordering = ["-id"]
        verbose_name = "Ad"
        verbose_name_plural = "Ad's"


class Gallery(models.Model):
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_media",
    )
    # media = models.TextField(_("Media"), null=True, blank=True)
    media_urls = models.JSONField(_("Media"), default=dict, null=True, blank=True)

    def __str__(self):
        return f"{self.ad}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Gallery"
        verbose_name_plural = "Galleries"


class FAQ(models.Model): 
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_faqs",
        null=True,
        blank=True,
    )

    question = models.TextField(_("Question"))
    answer = models.TextField(_("Answer"))

    def __str__(self):
        return f"{self.question}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQ'S"


class ActivationSubCategory(models.Model):
    sub_category = models.ForeignKey(
        "ads.SubCategory",
        verbose_name=_("SubCategorie"),
        on_delete=models.CASCADE,
        related_name="sub_category_countries",
    )

    def __str__(self):
        return f"{self.sub_category.name}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Activation Sub Category"
        verbose_name_plural = "Activation Sub Categories"


class RelatedSubCategory(models.Model):
    sub_category_1 = models.ForeignKey(
        "ads.SubCategory",
        verbose_name=_("SubCategorie 1"),
        on_delete=models.CASCADE,
        related_name="sub_category_relation_1",
    )
    sub_category_2 = models.ForeignKey(
        "ads.SubCategory",
        verbose_name=_("SubCategorie 2"),
        on_delete=models.CASCADE,
        related_name="sub_category_relation_2",
    )

    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Related Sub Category"
        verbose_name_plural = "Related Sub Categories"
        unique_together = ["sub_category_1", "sub_category_2"]


class Service(models.Model):
    sub_category = models.ManyToManyField(
        "ads.SubCategory",
        verbose_name=_("Sub Category"),
        related_name="service_sub_category",
    )
    service = ArrayField(base_field=models.TextField())

    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Service"
        verbose_name_plural = "Services"


class SectionName(models.Model):
    name = models.TextField(_("Name"), unique=True)


class SiteFAQ(models.Model):
    category = models.ForeignKey(
        "ads.Category",
        verbose_name=_("Category"),
        on_delete=models.CASCADE,
        related_name="site_faq_category",
    )
    sub_category = models.ManyToManyField(
        "ads.SubCategory",
        verbose_name=_("Sub Category"),
        related_name="site_faq_sub_category",
    )
    section = models.ForeignKey(
        "ads.SectionName",
        verbose_name=_("Section"),
        on_delete=models.CASCADE,
        related_name="site_faq_section",
    )

    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Site FAQ"
        verbose_name_plural = "Site FAQ's"


class SiteQuestion(models.Model):
    site_faq = models.ForeignKey(
        "ads.SiteFAQ",
        verbose_name=_("Site FAQ"),
        on_delete=models.CASCADE,
        related_name="site_faq_questions",
    )
    question = models.TextField(_("Question"))
    suggestion = ArrayField(base_field=models.TextField(), null=True, blank=True)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Site Question"
        verbose_name_plural = "Site Questions"


class AdFAQ(models.Model):
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Commercial"),
        on_delete=models.CASCADE,
        related_name="ad_faq_ad",
    )
    site_question = models.ForeignKey(
        "ads.SiteQuestion",
        verbose_name=_("Site Question"),
        on_delete=models.CASCADE,
        related_name="ad_faq_site_question",
    )
    answer = models.TextField(_("Answer"))

    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Ad FAQ"
        verbose_name_plural = "Ad FAQ's"
