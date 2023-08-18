from apps.analytics.models import AdSaved
from apps.utils.serializers.base import BaseSerializer


class AdSavedCreateSerializer(BaseSerializer):
    
    class Meta:
        model = AdSaved
        fields = ["ad"]