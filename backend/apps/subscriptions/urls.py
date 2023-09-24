from rest_framework.routers import DefaultRouter

from apps.subscriptions.views.subscription_viewset import SubscriptionsViewSet

router = DefaultRouter()
router.register("", SubscriptionsViewSet, basename="subscription")

app_name = "subscriptions"

urlpatterns = []

urlpatterns = urlpatterns + router.urls
