from apps.ads.models import SubCategory, Category, Ad
from django.utils import timezone
from datetime import timedelta

SUBSCRIPTION_TYPES = {
    "FREE": "free",
    "STANDARD": "standard",
    "ADVANCED": "advanced",
    "FEATURED": "featured",
}
PRODUCT_NAMES = {
    "standard": "standard",
    "advanced": "advanced",
    "featured": "featured",
}
KEYWORD_MODEL_MAPPING = {
    "sub_category__name": SubCategory,
    "sub_category__category__name": Category,
    "commercial_name": Ad,
}

DATE_RANGE_MAPPING = {
    "one_week_ago": timezone.now() - timedelta(days=7),
    "one_month_ago": timezone.now() - timedelta(days=30),
}
