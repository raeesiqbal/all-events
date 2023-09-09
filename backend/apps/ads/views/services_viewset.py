from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.ads.models import Service, SubCategory
from apps.ads.serializers.get_serializers import ServiceGetSerializer
from apps.utils.views.base import BaseViewset, ResponseInfo


class ServiceViewSet(BaseViewset):
    """
    API endpoints that manages Services.
    """

    queryset = Service.objects.all()
    action_serializers = {
        "default": ServiceGetSerializer,
    }
    action_permissions = {
        "default": [],
        "list": [],
    }

    @action(detail=True, url_path="get-services", methods=["get"])
    def get_services(self, request, *args, **kwargs):
        services = Service.objects.filter(sub_category__id=kwargs["pk"])

        data = ServiceGetSerializer(services, many=True).data

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=data,
                status_code=status.HTTP_200_OK,
                message="Services",
            ),
        )
