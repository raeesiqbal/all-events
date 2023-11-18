# imports
from rest_framework import serializers
from apps.users.field_validators import CustomPasswordValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# serializers
from apps.companies.serializers.get_serializers import CompanyListSerializer

# models
from apps.users.models import User
from apps.companies.models import Company
from apps.utils.serializers.base import BaseSerializer


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=6,
        write_only=True,
        validators=[CustomPasswordValidator()],
    )

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "password",
            "role_type",
            "is_active",
        ]


class UpdateProfileSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(required=False)
    new_password = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone",
            "old_password",
            "new_password",
        ]


class NewsLetterSerializer(serializers.Serializer):
    newsletter = serializers.BooleanField(required=True)


class GetUserSerializer(serializers.ModelSerializer):
    user_company = CompanyListSerializer()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "role_type",
            "date_joined",
            "phone",
            "user_company",
            "image",
            "is_verified",
            "newsletter",
        ]


class UpdatePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

    class Meta:
        model = User
        fields = ["old_password", "new_password"]


class CompanyChildGetSerializer(BaseSerializer):
    class Meta:
        model = Company
        fields = ["name", "address"]


class GetUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "role_type",
            "date_joined",
            "phone",
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, value):
        data = super(CustomTokenObtainPairSerializer, self).validate(value)

        # data["user"] = GetUserDetailSerializer(self.user).data
        data["user"] = GetUserSerializer(self.user).data

        return data


class ValidatePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField()

    class Meta:
        model = User
        fields = ["password"]


class GetUserDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone",
            "image",
        ]
