
from rest_framework.permissions import IsAuthenticated
from apps.analytics.models import AdReview, FavouriteAd
from rest_framework.decorators import action

from apps.analytics.serializers.create_serializer import AdReviewCreateSerializer, FavouriteAdCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from apps.analytics.serializers.get_serializer import AdReviewGetSerializer
from apps.users.constants import USER_ROLE_TYPES
from apps.users.models import User
from apps.users.permissions import IsClient, IsSuperAdmin, IsVendorUser
from apps.utils.views.base import BaseViewset, ResponseInfo


class AdReviewViewSet(BaseViewset):
    """
    API endpoints that manages Ad Review ViewSet.
    """

    queryset = AdReview.objects.all()
    action_serializers = {
        "create": AdReviewCreateSerializer,
        "ad_reviews":AdReviewGetSerializer
    }
    action_permissions = {
        "create": [IsAuthenticated|IsClient],
        "ad_reviews":[]
    }

    
    @action(detail=False, url_path="list", methods=["get"])
    def public_ad_reviews(self, request, *args, **kwargs):
        
        slug=request.GET.get("slug")
        queryset=AdReview.objects.filter(ad__slug=slug)
        data=[]
        if len(queryset):
            queryset = self.filter_queryset(queryset)
            page = self.paginate_queryset(queryset)

            if page != None:
                serializer = AdReviewGetSerializer(page, many=True)
            else:
                serializer = AdReviewGetSerializer(queryset, many=True)

            data = serializer.data
            if page != None:
                data = self.get_paginated_response(data).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data, status_code=status.HTTP_200_OK, message="Review List"
            ),
        )



    

