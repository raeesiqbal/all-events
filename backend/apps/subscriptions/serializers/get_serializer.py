from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer


class TestSerializer(BaseSerializer):
    class Meta:
        model = Client
        fields = ["user"]
