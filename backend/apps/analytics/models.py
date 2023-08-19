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
        related_name="ad_saved"
    )
    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="my_fav_ads"
    )
    class Meta:
        unique_together = ["ad", "user"]


class AdReview(NewAbstractModel):
   
    title=models.TextField()
    name=models.TextField(null=True,blank=True)
    rating=models.FloatField(null=True,blank=True)
    message=models.TextField(null=True,blank=True)
    photos=ArrayField(base_field=models.TextField(), null=True, blank=True)
    
    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="my_reviews"
    )
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_reviews"
    )


class Chat(NewAbstractModel):
    
    client = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="my_chats"
    )
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_chats"
    )
    event_date=models.DateField(_("Event Date"), auto_now=False, auto_now_add=False)
    is_archived=models.BooleanField(default=False)

    class Meta:
        unique_together = ["ad", "client"]


class Message(NewAbstractModel):
    
    text=models.TextField(null=True,blank=True)
    sender=models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="my_messages"
    )
    is_read=models.BooleanField(default=False)

    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name="chat_messages"
    )
    
