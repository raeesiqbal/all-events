# imports
from apps.utils.serializers.base import BaseSerializer

# models
from apps.ads.models import (
    Category,
    SubCategory,
)


class SubCategoryGetSerializer(BaseSerializer):
    class Meta:
        model = SubCategory
        fields = ["name"]


class CategoryGetSerializer(BaseSerializer):
    sub_categories = SubCategoryGetSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["name", "sub_categories"]
