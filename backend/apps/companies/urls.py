from rest_framework.routers import DefaultRouter

from apps.companies.views.company_viewset import CompanyViewSet


router = DefaultRouter()
router.register('', CompanyViewSet, basename='companies')
app_name = 'companies'

urlpatterns = []

urlpatterns = urlpatterns + router.urls
