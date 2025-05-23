# Imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from apps.subscriptions.stripe_service import StripeService
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import jwt
from datetime import datetime, timedelta
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from rest_framework_simplejwt.tokens import RefreshToken
from apps.utils.utils import user_verify_account
from tempfile import NamedTemporaryFile
from apps.utils.tasks import upload_profile_image, delete_s3_object, resize_image
from apps.utils.services.s3_service import S3Service

# Constants
from apps.subscriptions.constants import SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES
from apps.users.constants import USER_ROLE_TYPES
from apps.ads.constants import AD_STATUS
from my_site.settings import SECRET_KEY

# Permissions
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import (
    IsSuperAdmin,
    IsVendorUser,
    IsClient,
    IsVerified,
)

# serializers
from apps.ads.serializers.create_serializers import UserImageSerializer
from apps.companies.serializers.update_serializers import (
    UserDeleteSerializer,
    UserUpdateSerializer,
)
from apps.users.serializers import (
    CustomTokenObtainPairSerializer,
    GetUserSerializer,
    UpdatePasswordSerializer,
    ValidatePasswordSerializer,
    NewsLetterSerializer,
)

# models
from apps.subscriptions.models import Subscription, SubscriptionType
from apps.users.models import User, VerificationToken
from apps.ads.models import Ad


class UserViewSet(BaseViewset):
    """
    API endpoints that allows users to be viewed.
    """

    queryset = User.objects.all()
    action_serializers = {
        "default": GetUserSerializer,
        "validate_user": ValidatePasswordSerializer,
        "update_password": UpdatePasswordSerializer,
        "partial_update": UserUpdateSerializer,
        "delete_user": UserDeleteSerializer,
        "upload_user_image": UserImageSerializer,
        "newsletter": NewsLetterSerializer,
    }
    action_permissions = {
        "default": [IsAuthenticated],
        "partial_update": [
            IsAuthenticated,
            IsSuperAdmin | IsVendorUser | IsClient,
        ],
        "retrieve": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "delete_user": [IsAuthenticated, IsVerified, IsSuperAdmin | IsVendorUser],
        "upload_user_image": [IsAuthenticated, IsVerified],
        "newsletter": [IsAuthenticated, IsVerified],
        "verify_account_email": [],
        "verify_account": [],
    }
    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: User.objects.filter(
            id=self.request.user.id
        )
    }
    stripe_service = StripeService()
    s3 = S3Service()

    @action(detail=False, url_path="validate-user", methods=["post"])
    def validate_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data.get("password", None)
        user = request.user
        if not user.check_password(password):
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data=ResponseInfo().format_response(
                    data={},
                    message="Passowrd incorrect",
                    status_code=status.HTTP_403_FORBIDDEN,
                ),
            )
        token = jwt.encode(
            {
                "id": user.id,
                "exp": datetime.datetime.now(tz=datetime.timezone.utc)
                + datetime.timedelta(minutes=20),
            },
            SECRET_KEY,
            algorithm="HS256",
        )
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"token": token},
                message="token generated",
                status_code=status.HTTP_200_OK,
            ),
        )

    # account verify
    @action(detail=False, url_path="verify-account", methods=["patch"])
    def verify_account(self, request, *args, **kwargs):
        token = request.data.get("token")
        token = VerificationToken.objects.filter(token=token).first()
        if token and token.user.is_verified == False:
            signer = TimestampSigner()
            try:
                # Verify the token and check if it's expired
                user_id = signer.unsign(token.token, max_age=timedelta(days=7))
                # Check token expiration
            except (BadSignature, SignatureExpired):
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data=ResponseInfo().format_response(
                        data={},
                        status_code=status.HTTP_400_BAD_REQUEST,
                        message="Invalid or expired token",
                    ),
                )
            user = token.user
            user.is_verified = True
            user.save()
            VerificationToken.objects.filter(user=user).delete()
            # Generate new access and refresh tokens
            refresh = RefreshToken.for_user(user)
            serializer = GetUserSerializer(user)
            data = {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": serializer.data,
                "message": "Account has been verified successfully",
            }
            return Response(data, status=status.HTTP_200_OK)

        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Invalid or expired token",
            ),
        )

    @action(detail=False, url_path="verify-account-email", methods=["get"])
    def verify_account_email(self, request, *args, **kwargs):
        user = request.user
        if not user:
            message = "User does not exits"
        else:
            if user.is_verified:
                message = "User is already verified"
        if user and user.is_verified == False:
            user_verify_account(user)
            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data={},
                    status_code=status.HTTP_200_OK,
                    message="Account verification email has been sent",
                ),
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message=message,
            ),
        )

    @action(detail=False, url_path="me", methods=["get"])
    def get_me(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user, many=False)

        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=serializer.data,
                message="Me",
                status_code=status.HTTP_200_OK,
            ),
        )

    @action(detail=False, url_path="update-password", methods=["patch"])
    def update_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_password = serializer.validated_data.get("old_password")
        new_password = serializer.validated_data.get("new_password")

        user = request.user

        if not user.check_password(old_password):
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data=ResponseInfo().format_response(
                    data={},
                    message="Password incorrect",
                    status_code=status.HTTP_403_FORBIDDEN,
                ),
            )

        user.set_password(new_password)
        user.save()

        # Generate new access and refresh tokens
        refresh = RefreshToken.for_user(user)
        serializer = GetUserSerializer(user)

        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": serializer.data,
            "message": "Password has been updated successfully",
        }
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, url_path="delete", methods=["post"])
    def delete_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resp_status = status.HTTP_200_OK
        user = request.user

        if user.check_password(serializer.validated_data.pop("password")):
            if user.role_type == USER_ROLE_TYPES["VENDOR"]:
                company = user.user_company
                company_subscription = Subscription.objects.filter(
                    company=company,
                    status__in=[
                        SUBSCRIPTION_STATUS["ACTIVE"],
                        SUBSCRIPTION_STATUS["UNPAID"],
                    ],
                ).first()
                free_type = SubscriptionType.objects.filter(
                    type=SUBSCRIPTION_TYPES["FREE"]
                ).first()

                if company_subscription.type == free_type:
                    Ad.objects.filter(company=company).update(
                        status=AD_STATUS["INACTIVE"]
                    )
                    company_subscription.status = SUBSCRIPTION_STATUS["CANCELLED"]
                    company_subscription.save()

                else:
                    self.stripe_service.cancel_subscription_immediately(
                        company_subscription.subscription_id
                    )

            user.delete_reason = serializer.validated_data.pop("delete_reason")
            user.is_active = False
            user.newsletter = False
            user.save()
        else:
            resp_status = status.HTTP_400_BAD_REQUEST

        return Response(
            status=resp_status,
            data=ResponseInfo().format_response(
                data={},
                message="Account Deleted",
                status_code=resp_status,
            ),
        )

    @action(detail=False, url_path="upload-user-image", methods=["post"])
    def upload_user_image(self, request, *args, **kwargs):
        import os
        import environ

        env = environ.Env()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data.get("file")
        content_type = serializer.validated_data.get("content_type")
        user = request.user
        if request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            upload_folder = f"vendors/{user.email}/profile"
        elif request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            upload_folder = f"clients/{user.email}/profile"
        if user.image:
            delete_s3_object.delay(user.image)
            user.image = None
            user.save()
        # Uploading file
        image_url = None
        name = file.name
        with NamedTemporaryFile(delete=False) as temp_file:
            temp_file_path = temp_file.name
            temp_file.write(file.read())
            temp_file.seek(0)
        max_size = float(env.str("IMAGE_SIZE", 2))
        original_size = os.path.getsize(temp_file_path) / (1024 * 1024)
        if original_size > max_size:
            file = resize_image(temp_file_path, max_size)
            content_type = "image/jpeg"
            name = os.path.basename(file.name) + ".jpg"
            file_content = file.read()
            file.close()
        else:
            with open(temp_file_path, "rb") as file:
                file_content = file.read()
        file.close()
        image_url = self.s3.upload_binary_file(
            file_content, content_type, upload_folder, name
        )
        user.image = image_url
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"file_url": image_url},
                status_code=status.HTTP_200_OK,
                message="User image uploaded",
            ),
        )

    @action(detail=False, url_path="upload-user-image", methods=["post"])
    def upload_user_images(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data.get("file")
        content_type = serializer.validated_data.get("content_type")
        email = request.user.email
        if request.user.role_type == USER_ROLE_TYPES["VENDOR"]:
            upload_folder = f"vendors/{email}/profile"
        elif request.user.role_type == USER_ROLE_TYPES["CLIENT"]:
            upload_folder = f"clients/{email}/profile"
        image_url = None
        # Uploading image to S3
        with NamedTemporaryFile(delete=False) as temp_file:
            temp_file_path = temp_file.name
            temp_file.write(file.read())
            temp_file.seek(0)
        image_url = upload_profile_image.delay(
            temp_file_path,
            content_type,
            file.name,
            upload_folder,
            user_id=request.user.id,
        )
        file.close()
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data={"file_url": image_url},
                status_code=status.HTTP_200_OK,
                message="User image uploaded",
            ),
        )

    @action(detail=False, url_path="newsletter", methods=["patch"])
    def newsletter(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        newsletter = serializer.validated_data.pop("newsletter", True)
        user = request.user
        user.newsletter = newsletter
        user.save()
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=user.newsletter,
                status_code=status.HTTP_200_OK,
                message="Newsletter is updated",
            ),
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        if User.objects.filter(email__iexact=request.data["email"]).exists():
            user = User.objects.filter(email__iexact=request.data["email"]).first()
            request.data["email"] = user.email

        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        return super().post(request, *args, **kwargs)
