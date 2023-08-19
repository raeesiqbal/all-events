from rest_framework.routers import DefaultRouter

from apps.clients.views.client_viewset import ClientViewSet

router = DefaultRouter()
router.register('', ClientViewSet, basename='client')

app_name = 'clients'

urlpatterns = []

urlpatterns = urlpatterns + router.urls
