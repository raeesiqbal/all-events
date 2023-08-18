
from rest_framework.permissions import IsAuthenticated
from apps.analytics.models import AdSaved

from apps.analytics.serializers.create_serializer import AdSavedCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from apps.users.models import User
from apps.users.permissions import IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo


class AdSavedViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = AdSaved.objects.all()
    action_serializers = {
        "create": AdSavedCreateSerializer,
    }
    action_permissions = {
        "create": [IsAuthenticated]
    }
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # TODO
        # check for role_type is due 
        user=User.objects.filter(id=request.user.id).first()
        
        resp_status=status.HTTP_400_BAD_REQUEST
        if user:
            resp_status=status.HTTP_200_OK
            saved_ad=AdSaved.objects.filter(user=user)
            if saved_ad.exists():
                saved_ad.delete()
            else:
                AdSaved.objects.create(**serializer.validated_data,user=user)

        return Response(
            status=resp_status,
            data=ResponseInfo().format_response(
                data={}, status_code=resp_status, message="Ad Saved Response"
            ),
        )
    

