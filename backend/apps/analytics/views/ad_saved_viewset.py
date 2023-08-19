
from rest_framework.permissions import IsAuthenticated
from apps.analytics.models import FavouriteAd

from apps.analytics.serializers.create_serializer import FavouriteAdCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from apps.users.constants import USER_ROLE_TYPES
from apps.users.models import User
from apps.users.permissions import IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo


class FavouriteAdViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = FavouriteAd.objects.all()
    action_serializers = {
        "create": FavouriteAdCreateSerializer,
    }
    action_permissions = {
        "create": [IsAuthenticated]
    }
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # TODO
        # check for role_type is due 
        user=User.objects.filter(id=request.user.id,role_type=USER_ROLE_TYPES["CLIENT"]).first()
        
        resp_status=status.HTTP_400_BAD_REQUEST
        if user:
            resp_status=status.HTTP_200_OK
            saved_ad=FavouriteAd.objects.filter(user=user)
            if saved_ad.exists():
                saved_ad.delete()
            else:
                FavouriteAd.objects.create(**serializer.validated_data,user=user)

        return Response(
            status=resp_status,
            data=ResponseInfo().format_response(
                data={}, status_code=resp_status, message="Ad Saved Response"
            ),
        )
    

