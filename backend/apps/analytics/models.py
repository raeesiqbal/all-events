from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.models import User

from apps.utils.models.base import NewAbstractModel

class AdSaved(NewAbstractModel):
    
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


class AdViewed(NewAbstractModel):
    
    ad = models.ForeignKey(
        "ads.Ad",
        verbose_name=_("Ad"),
        on_delete=models.CASCADE,
        related_name="ad_views"
    )
    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="my_views",null=True,blank=True
    )

