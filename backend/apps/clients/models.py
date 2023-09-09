from django.db import models
from apps.utils.models.base import NewAbstractModel


class Client(NewAbstractModel):
    user = models.OneToOneField(
        "users.User", on_delete=models.CASCADE, related_name="client_profile"
    )

    def __str__(self):
        return f"{self.user.email}"

    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"
