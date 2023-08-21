from rest_framework.routers import DefaultRouter
from apps.analytics.views.ad_messages_viewset import MessageViewSet
from apps.analytics.views.ad_review_viewset import AdReviewViewSet
from apps.analytics.views.ad_saved_viewset import FavouriteAdViewSet

router = DefaultRouter()
router.register('ad-fav', FavouriteAdViewSet, basename='ad_fav')
router.register('ad-review', AdReviewViewSet, basename='ad_review')
router.register('ad-chat', MessageViewSet, basename='ad_message')


app_name = 'analytics'

urlpatterns = []

urlpatterns = urlpatterns + router.urls
