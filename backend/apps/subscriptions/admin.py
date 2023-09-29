from django.contrib import admin

from apps.subscriptions.models import Subscription, SubscriptionType, PaymentMethod

# Register your models here.
admin.site.register(Subscription)
admin.site.register(SubscriptionType)
admin.site.register(PaymentMethod)
