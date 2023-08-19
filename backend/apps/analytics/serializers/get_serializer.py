from apps.analytics.models import AdReview
from apps.utils.serializers.base import BaseSerializer


class AdReviewGetSerializer(BaseSerializer):
    
    class Meta:
        model = AdReview
        fields = "__all__"