from rest_framework.routers import DefaultRouter
from apps.ads.views.ads_veiwset import AdViewSet
from apps.ads.views.categories_viewset import CategoryViewSet
from apps.ads.views.countries_viewset import CountryViewSet
from apps.ads.views.faqs_viewset import FaqsViewSet
from apps.ads.views.sub_category_viewset import SubCategoryViewSet

router = DefaultRouter()
router.register('country', CountryViewSet, basename='country')
router.register('category', CategoryViewSet, basename='category')
router.register('sub_category', SubCategoryViewSet, basename='sub_category')
router.register('faq', FaqsViewSet, basename='faq')
router.register('', AdViewSet, basename='ad')


app_name = 'ads'

urlpatterns = []

urlpatterns = urlpatterns + router.urls
