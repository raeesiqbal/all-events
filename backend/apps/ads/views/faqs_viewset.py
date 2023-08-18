from datetime import date

from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import action
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.ads.models import FAQ, Country
from apps.ads.serializers.create_serializers import FaqsCreateSerializer
from apps.ads.serializers.get_serializers import FaqsGetSerializer
from apps.ads.serializers.update_serializer import FaqsUpdateSerializer
from apps.users.models import User

from apps.users.permissions import IsSuperAdmin,IsVendorUser
from apps.utils.views.base import BaseViewset,ResponseInfo

class FaqsViewSet(BaseViewset):
    """
    API endpoints that manages Faqs.
    """
    queryset = FAQ.objects.all()
    action_serializers = {
        'default':FaqsGetSerializer,
        'create':FaqsCreateSerializer,
        'partial_update':FaqsUpdateSerializer
       
    }
    action_permissions = {
        'default': [IsAuthenticated],
        'create':[IsAuthenticated,IsSuperAdmin|IsVendorUser],
        'list':[],
        'retrieve':[],
        'partial_update':[]
    }
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_param = 'search'
    search_fields = []
    ordering_fields = []
    filterset_fields = {}