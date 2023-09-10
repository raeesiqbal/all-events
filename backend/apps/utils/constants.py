from apps.ads.models import SubCategory,Category,Ad


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
    "sub_category__name":SubCategory,
    "sub_category__category__name":Category,
    "commercial_name":Ad
}
