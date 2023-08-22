from apps.clients.models import Client
from apps.users.models import User 
from apps.utils.serializers.base import BaseSerializer

class ClientUserChildSerializer(BaseSerializer):
    
    class Meta:
        model = User
        fields = [ 'email', 'first_name', 'last_name',
                  'phone','password','newsletter','terms_acceptance','image']

   

class ClientCreateSerializer(BaseSerializer):
    user=ClientUserChildSerializer()
    
    class Meta:
        model = Client
        fields = ["user"]