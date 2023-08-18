from rest_framework.routers import DefaultRouter

from apps.analytics.views.ad_saved_viewset import AdSavedViewSet

router = DefaultRouter()
router.register('ad-saved', AdSavedViewSet, basename='ad_saved')

app_name = 'analytics'

urlpatterns = []

urlpatterns = urlpatterns + router.urls
