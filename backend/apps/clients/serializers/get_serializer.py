from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer


class ClientListUserChildSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone",
            "newsletter",
            "image",
        ]


class ClientRetrieveUserChildSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone",
            "image",
        ]


class ClientListSerializer(BaseSerializer):
    user = ClientListUserChildSerializer()

    class Meta:
        model = Client
        fields = ["user"]


class ClientGetSerializer(BaseSerializer):
    user = ClientRetrieveUserChildSerializer()

    class Meta:
        model = Client
        fields = ["user"]
