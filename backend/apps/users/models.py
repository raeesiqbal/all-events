from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.users.constants import USER_ROLE_TYPES


class UserManager(BaseUserManager):
    """
    Define a model manager for User model with no username field.
    """

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError("The given email must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular User with the given email and password.
        """
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role_type", USER_ROLE_TYPES["SUPER_ADMIN"])

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)

    def role_users(self, role, is_active=True):
        return self.filter(role=role, is_active=is_active)


class User(AbstractUser):
    """
    User model.
    """

    ROLE_TYPES = (
        (USER_ROLE_TYPES["SUPER_ADMIN"], "super_admin"),
        (USER_ROLE_TYPES["VENDOR"], "vendor"),
        (USER_ROLE_TYPES["CLIENT"], "client"),
    )

    username = None
    email = models.EmailField(_("email address"), unique=True)

    role_type = models.CharField(
        max_length=50, choices=ROLE_TYPES, default=USER_ROLE_TYPES["VENDOR"]
    )

    phone = models.TextField(null=True, blank=True)

    newsletter = models.BooleanField(default=False)
    terms_acceptance = models.BooleanField(default=False)
    delete_reason = models.TextField(null=True, blank=True)

    image = models.TextField(null=True, blank=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        ordering = ["-id"]
        verbose_name = "User"
        verbose_name_plural = "Users"
