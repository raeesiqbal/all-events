from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer


class ClientUserChildSerializer(BaseSerializer):
    def to_internal_value(self, data):
        if "first_name" in data:
            data["first_name"] = data["first_name"].capitalize()
        if "last_name" in data:
            data["last_name"] = data["last_name"].capitalize()

        if "email" in data:
            data["email"] = data["email"].lower()
        return super().to_internal_value(data)

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone",
            "password",
            "newsletter",
            "terms_acceptance",
        ]


class ClientCreateSerializer(BaseSerializer):
    user = ClientUserChildSerializer()

    class Meta:
        model = Client
        fields = ["user"]
