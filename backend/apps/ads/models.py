from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField
from apps.ads.constants import FAQ_TYPE
from apps.utils.models.base import AbstractBaseModel, NewAbstractModel
from apps.utils.utils import unique_slugify


class Country(models.Model):
    name = models.TextField(_("Judet"))

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"


class Category(models.Model):
    name = models.TextField(_("Categorie"))

    def __str__(self):
        return f"{self.name}"

    class Meta:
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
        verbose_name = "Sub Category"
        verbose_name_plural = "Sub Categories"


class Ad(NewAbstractModel):
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
    
    total_views=models.IntegerField(_("Total Views"), default=0)
    
    def __str__(self):
        return f"{self.name}"
    
    def save(self, *args, **kwargs):
        self.slug = unique_slugify(Ad, self.name, self.id)
        super(Ad, self).save(*args, **kwargs)


    class Meta:
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
    sub_category = models.ForeignKey(
        "ads.SubCategory", verbose_name=_("Sub Categorie"), on_delete=models.CASCADE
    )
    Types = (
        (FAQ_TYPE["TEXT_FIELD"], "text_field"),
        (FAQ_TYPE["CHECKBOX"], "checkbox"),
    )
    question = models.TextField(_("Question"))
    type = models.CharField(_("Type"), choices=Types, max_length=50)
    answer_input = models.TextField(_("Answer Input"), null=True, blank=True)
    answer_checkbox = models.BooleanField(_("Answer Checkbox"), default=False)

    def __str__(self):
        return f"{self.question}"

    class Meta:
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
        verbose_name = "Related Sub Category"
        verbose_name_plural = "Related Sub Categories"
        unique_together = ["sub_category_1", "sub_category_2"]
