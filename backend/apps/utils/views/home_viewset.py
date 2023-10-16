# imports
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

# models
from apps.ads.models import Category

# serializers
from apps.utils.serializers.home_serializer import CategoryGetSerializer


from apps.utils.views.base import BaseViewset, ResponseInfo


class HomeViewSet(BaseViewset):
    """
    API endpoints that manages utils
    """

    action_serializers = {
        "default": CategoryGetSerializer,
    }
    action_permissions = {
        "default": [],
    }

    @action(detail=False, url_path="get-header", methods=["get"])
    def get_header(self, request, *args, **kwargs):
        categories = Category.objects.prefetch_related("sub_categories").all()
        serializer = self.get_serializer(categories, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=serializer.data, status_code=status.HTTP_200_OK, message="Header"
            ),
        )
