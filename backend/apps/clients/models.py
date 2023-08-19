from django.db import models
from apps.utils.models.base import NewAbstractModel


class Client(NewAbstractModel):
    user = models.OneToOneField(
         "users.User", on_delete=models.CASCADE, related_name="client_profile"
    )
    