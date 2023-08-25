from rest_framework.routers import DefaultRouter
from apps.analytics.views.ad_messages_viewset import MessageViewSet
from apps.analytics.views.ad_review_viewset import AdReviewViewSet
from apps.analytics.views.ad_fav_viewset import FavouriteAdViewSet
from apps.analytics.views.ad_contact_viewset import ContactViewSet

router = DefaultRouter()
router.register("ad-fav", FavouriteAdViewSet, basename="ad_fav")
router.register("ad-review", AdReviewViewSet, basename="ad_review")
router.register("ad-chat", MessageViewSet, basename="ad_message")
router.register("ad-contact", ContactViewSet, basename="ad_contact")


app_name = "analytics"

urlpatterns = []

urlpatterns = urlpatterns + router.urls
