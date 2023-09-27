from django.dispatch import Signal
from django.db.models import Model
from django.db.models import BooleanField, DateTimeField, ForeignKey, SET_NULL
from django.utils import timezone

post_archive = Signal()
post_unarchive = Signal()


class AbstractBaseModel(Model):
    created_by = ForeignKey(
        "users.User", on_delete=SET_NULL, null=True, blank=True, related_name="+"
    )
    created_at = DateTimeField(default=timezone.now)
    updated_by = ForeignKey(
        "users.User", on_delete=SET_NULL, null=True, blank=True, related_name="+"
    )
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-id"]


class NewAbstractModel(Model):
    created_at = DateTimeField(default=timezone.now)

    updated_at = DateTimeField(auto_now=True)

    class Meta:
        abstract = True
