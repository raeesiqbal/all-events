from django.db import models

from apps.utils.constants import SUBSCRIPTION_TYPES

class Subscription(models.Model):
    
    types = (
        (SUBSCRIPTION_TYPES["FREE"], "free"),
        (SUBSCRIPTION_TYPES["STANDARD"], "standard"),
        (SUBSCRIPTION_TYPES["ADVANCED"], "advanced"),
        (SUBSCRIPTION_TYPES["FEATURED"], "featured"),
    )
    type = models.CharField(max_length=150,default=SUBSCRIPTION_TYPES["FREE"],choices=types)
    company=models.ForeignKey("companies.Company", on_delete=models.CASCADE, related_name="my_subscriptions")

    

