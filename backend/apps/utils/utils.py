
from datetime import datetime
from datetime import timedelta
from django.db.models import Q
from django.template.defaultfilters import slugify
from django.utils.crypto import get_random_string


def unique_slugify(Model, str_to_slug, id):
    unique_slug = slugify(str_to_slug)
    while Model.objects.filter(Q(slug=unique_slug), ~Q(id=id)).exists():
        unique_slug = unique_slug + '-' + get_random_string(length=4)
    return unique_slug
