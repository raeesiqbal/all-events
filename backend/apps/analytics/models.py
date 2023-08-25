from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User
from django.contrib.postgres.fields import ArrayField

from apps.utils.models.base import NewAbstractModel


class FavouriteAd(NewAbstractModel):
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_saved",
    )
    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="my_fav_ads"
    )

    def __str__(self):
        return f"{self.user.email} --> {self.ad.name}"

    class Meta:
        ordering = ["-id"]
        unique_together = ["ad", "user"]
        verbose_name = "Favourite Ad"
        verbose_name_plural = "Favourite Ads"


class AdReview(NewAbstractModel):
    title = models.TextField()
    name = models.TextField(null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    photos = ArrayField(base_field=models.TextField(), null=True, blank=True)

    client = models.ForeignKey(
        "clients.Client", on_delete=models.CASCADE, related_name="my_reviews"
    )
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_reviews",
    )

    def __str__(self):
        return f"{self.client.email} --> {self.ad.name}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Ad Review"
        verbose_name_plural = "Ad Reviews"


class Chat(NewAbstractModel):
    client = models.ForeignKey(
        "clients.Client", on_delete=models.CASCADE, related_name="my_chats"
    )
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_chats",
    )
    event_date = models.DateField(_("Event Date"), auto_now=False, auto_now_add=False)
    latest_message = models.ForeignKey(
        "analytics.Message",
        verbose_name=_("Last Message"),
        on_delete=models.SET_NULL,
        related_name="last_message",
        null=True,
    )
    is_archived_vendor = models.BooleanField(_("Is Archived Vendor"), default=False)
    is_archived_client = models.BooleanField(_("Is Archived Client"), default=False)
    is_read_vendor = models.BooleanField(_("Is Read Vendor"), default=False)
    is_read_client = models.BooleanField(_("Is Read Client"), default=False)
    is_delete_vendor = models.BooleanField(_("Is Delete Vendor"), default=False)
    is_delete_client = models.BooleanField(_("Is Delete Client"), default=False)

    def __str__(self):
        return f"{self.client.user.email} --> {self.ad.name}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Chat"
        verbose_name_plural = "Chats"


class Message(NewAbstractModel):
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name="chat_messages"
    )
    sender = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="my_messages"
    )
    text = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.id}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Message"
        verbose_name_plural = "Messages"


class ContactRequest(NewAbstractModel):
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_contacts",
    )
    email = models.EmailField(_("Email"), max_length=254)
    full_name = models.TextField(_("Full Name"))
    phone = models.TextField(_("Phone"))
    event_date = models.DateField(_("Event Date"), auto_now=False, auto_now_add=False)
    message = models.TextField(_("Message"))

    def __str__(self):
        return f"{self.ad.name}"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Contact Request"
        verbose_name_plural = "Contact Requests"
