from apps.analytics.models import AdReview, FavouriteAd
from apps.utils.serializers.base import BaseSerializer


class FavouriteAdCreateSerializer(BaseSerializer):
    
    class Meta:
        model = FavouriteAd
        fields = ["ad"]

class AdReviewCreateSerializer(BaseSerializer):
    
    class Meta:
        model = AdReview
        fields = "__all__"