from apps.companies.models import Company
from apps.users.models import User
from apps.utils.serializers.base import BaseSerializer


class CompanyListSerializer(BaseSerializer):
    
    class Meta:
        model = Company
        fields = '__all__'

class UserGetChildSerializer(BaseSerializer):

    class Meta:
        model = User
        fields = [ 'email', 'first_name', 'last_name',
                  'phone','newsletter','terms_acceptance','image']
   
class CompanyRetrieveSerializer(BaseSerializer):
    
    user=UserGetChildSerializer()
    class Meta:
        model = Company
        fields = '__all__'
