"""my_site URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from apps.users.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
import environ
from rest_framework.permissions import AllowAny, IsAuthenticated

env = environ.Env()


def get_swagger_permission_class():
    if env.bool("DEBUG", default=False):
        return [AllowAny]

    return [IsAuthenticated]


schema_view = get_schema_view(
    openapi.Info(
        title="My project",
        default_version="v1",
        description="API Description",
        terms_of_service="",
        contact=openapi.Contact(email="toseefcheama62gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path("admin/", admin.site.urls),
    # App URLs.
    path("api/users/", include("apps.users.urls", namespace="users")),
    path("api/companies/", include("apps.companies.urls", namespace="companies")),
    path("api/ads/", include("apps.ads.urls", namespace="ads")),
    path("api/analytics/", include("apps.analytics.urls", namespace="analytics")),
    path("api/clients/", include("apps.clients.urls", namespace="clients")),
    path("api/subscriptions/", include("apps.subscriptions.urls", namespace="subscriptions")),



    # JWT token urls.
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # swagger urls
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # ...
    # Password Reset URL
    path(
        "api/password-reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
]
# if env.bool('DEBUG', default=False):
#     import debug_toolbar
#     urlpatterns.append(
#         path('__debug__/', include(debug_toolbar.urls)),
#     )
