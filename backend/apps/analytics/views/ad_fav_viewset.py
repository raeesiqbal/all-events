from rest_framework.permissions import IsAuthenticated
from apps.analytics.serializers.create_serializer import FavouriteAdCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from apps.users.permissions import IsClient
from apps.utils.views.base import BaseViewset, ResponseInfo
from apps.analytics.models import FavouriteAd
from apps.ads.models import Ad


class FavouriteAdViewSet(BaseViewset):
    """
    API endpoints that manages Ad Saved.
    """

    queryset = FavouriteAd.objects.all()
    action_serializers = {
        "default": FavouriteAdCreateSerializer,
        "create": FavouriteAdCreateSerializer,
    }
    action_permissions = {"create": [IsAuthenticated, IsClient]}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if FavouriteAd.objects.filter(
            user=request.user, ad=serializer.validated_data.get("ad", {})
        ).exists():
            FavouriteAd.objects.filter(
                user=request.user, ad=serializer.validated_data.get("ad", {})
            ).delete()
        else:
            FavouriteAd.objects.create(**serializer.validated_data, user=request.user)
        return Response(
            status_code=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_200_OK,
                message="Ad marked as fav/unfav successfully",
            ),
        )
