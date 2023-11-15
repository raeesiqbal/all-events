# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

# serializers
from apps.analytics.serializers.get_serializer import FavouriteAdSerializer

# models
from apps.analytics.models import FavouriteAd
from apps.ads.models import Ad

# permissions
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsClient, IsVerified


# constants
from apps.users.constants import USER_ROLE_TYPES


class FavouriteAdViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = FavouriteAd.objects.all()
    action_serializers = {
        "default": FavouriteAdSerializer,
        "list": FavouriteAdSerializer,
    }
    action_permissions = {
        "create": [IsAuthenticated, IsVerified, IsClient],
        "list": [IsAuthenticated, IsVerified, IsClient],
    }
    user_role_queryset = {
        USER_ROLE_TYPES["CLIENT"]: lambda self: FavouriteAd.objects.filter(
            user=self.request.user
        )
    }

    @action(detail=True, url_path="fav", methods=["post"])
    def custom_create(self, request, *args, **kwargs):
        ad = Ad.objects.filter(id=kwargs.get("pk")).first()
        if FavouriteAd.objects.filter(user=request.user, ad=ad).exists():
            FavouriteAd.objects.filter(user=request.user, ad=ad).delete()
            status_code = status.HTTP_200_OK
        else:
            FavouriteAd.objects.create(ad=ad, user=request.user)
            status_code = status.HTTP_201_CREATED
        return Response(
            data=ResponseInfo().format_response(
                data={},
                status_code=status_code,
                message="Ad marked as fav/unfav successfully",
            ),
        )
