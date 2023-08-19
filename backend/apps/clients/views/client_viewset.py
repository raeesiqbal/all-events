
from rest_framework.permissions import IsAuthenticated
from apps.analytics.models import FavouriteAd

from apps.analytics.serializers.create_serializer import FavouriteAdCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from apps.clients.models import Client
from apps.clients.serializers.create_serializer import ClientCreateSerializer
from apps.clients.serializers.get_serializer import ClientGetSerializer, ClientListSerializer
from apps.clients.serializers.update_serializer import ClientUpdateSerializer
from apps.users.constants import USER_ROLE_TYPES
from apps.users.models import User
from apps.users.permissions import IsClient, IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo


class ClientViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = Client.objects.all()
    action_serializers = {
        "create": ClientCreateSerializer,
        "list":ClientListSerializer,
        "retrieve":ClientGetSerializer,
        "partial_update":ClientUpdateSerializer
    }
    action_permissions = {
        "default":[],
        "create": [],
        "list":[IsAuthenticated, IsSuperAdmin],
        "retrieve":[IsAuthenticated, IsSuperAdmin | IsClient]
    }
    user_role_queryset = {
        USER_ROLE_TYPES["CLIENT"]: lambda self: Client.objects.filter(
            user_id=self.request.user.id
        )
    }
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_details = serializer.validated_data.pop("user")

        user = User.objects.create(**user_details, role_type=USER_ROLE_TYPES["CLIENT"])
        # Setting password.
        user.set_password(user_details["password"])
        user.save()
        
        Client.objects.create( user=user)

        return Response(
            status=status.HTTP_201_CREATED,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_201_CREATED, message="Client Created"
            ),
        )
    

    def partial_update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_details=serializer.validated_data.pop("user")
        User.objects.filter(client_profile=self.get_object()).update(**user_details)
        
        #TODO will do this fields added in client
        # Client.objects.filter(id=kwargs.get("pk"))

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={}, status_code=status.HTTP_200_OK, message="Client Updated"
            ),
        )
    
    

