FAQ_TYPE = {"TEXT_FIELD": "text_field", "CHECKBOX": "checkbox"}

SEARCH_TYPE_MAPPING = {
    "sub_categories": "sub_category__name",
    "category": "sub_category__category__name",
    "commercial_name": "name",
}


AD_STATUS = {
    "ACTIVE": "active",
    "INACTIVE": "inactive",
}

AD_SORTING_ORDER = {
    "FREE": 0,
    "STANDARD": 1,
    "ADVANCED": 2,
    "FEATURED": 3,
}
