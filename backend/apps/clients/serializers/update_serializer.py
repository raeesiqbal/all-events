from apps.clients.models import Client
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer


class ClientUserUpdateChildSerializer(BaseSerializer):
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name',
                  'phone','image']

   

class ClientUpdateSerializer(BaseSerializer):
    user=ClientUserUpdateChildSerializer()
    
    class Meta:
        model = Client
        fields = ["user"]