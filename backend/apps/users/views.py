# imports
from apps.utils.views.base import BaseViewset, ResponseInfo
from apps.subscriptions.stripe_service import StripeService
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.utils.services.s3_service import S3Service
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import jwt
from django.conf import settings
from datetime import date, datetime, timedelta
from apps.utils.tasks import send_email_to_user
from django.template.loader import render_to_string
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken


# constants
from apps.subscriptions.constants import SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES
from apps.users.constants import USER_ROLE_TYPES
from apps.ads.constants import AD_STATUS
from my_site.settings import SECRET_KEY

# permissions
from apps.users.permissions import IsSuperAdmin, IsVendorUser, IsClient
from rest_framework.permissions import IsAuthenticated

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
    }
    action_permissions = {
        "default": [IsAuthenticated],
        "partial_update": [IsAuthenticated, IsSuperAdmin | IsVendorUser | IsClient],
        "retrieve": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "delete_user": [IsAuthenticated, IsSuperAdmin | IsVendorUser],
        "upload_user_image": [IsAuthenticated],
        "verify_account_email": [IsAuthenticated],
        "verify_account": [],
    }
    user_role_queryset = {
        USER_ROLE_TYPES["VENDOR"]: lambda self: User.objects.filter(
            id=self.request.user.id
        )
    }
    stripe_service = StripeService()

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
            token_data = {}
            if not request.user.is_authenticated:
                # Log in the user and generate a new JWT token
                login(request, user)

                # Generate a new JWT token using CustomTokenObtainPairView
                serializer = CustomTokenObtainPairSerializer(
                    data={"email": user.email, "password": "Pakchk12345"}
                )
                serializer.is_valid(raise_exception=True)
                token_data = serializer.validated_data

            return Response(
                status=status.HTTP_200_OK,
                data=ResponseInfo().format_response(
                    data=token_data,
                    status_code=status.HTTP_200_OK,
                    message="User has been verified successfully",
                ),
            )
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data=ResponseInfo().format_response(
                data={},
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Invalid or expired token",
            ),
        )

    @action(detail=True, url_path="verify-account-email", methods=["get"])
    def verify_account_email(self, request, *args, **kwargs):
        user = request.user
        if not user:
            message = "User does not exits"
        else:
            if user.is_verified:
                message = "User is already verified"
        if user and user.is_verified == False:
            # Generate token
            token = TimestampSigner().sign(str(user.id))
            # Create VerificationToken
            VerificationToken.objects.create(user=user, token=token)
            # Sending verify email
            url = settings.FRONTEND_URL
            context = {
                "full_name": "{} {}".format(
                    user.first_name.title(), user.last_name.title()
                ),
                "year": date.today().year,
                "verify_account_url": "{}/verify-account?token={}".format(url, token),
            }
            send_email_to_user.delay(
                "Verify your account",
                render_to_string("emails/verify_account/verify-account.html", context),
                render_to_string(
                    "emails/reset_password/user_reset_password.txt", context
                ),
                settings.EMAIL_HOST_USER,
                user.email,
            )
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
        # Log in the user and generate a new JWT token
        login(request, user)

        # Generate a new JWT token using CustomTokenObtainPairView
        serializer = CustomTokenObtainPairSerializer(
            data={"email": user.email, "password": "Pakchk12345"}
        )
        serializer.is_valid(raise_exception=True)
        token_data = serializer.validated_data
        return Response(
            status=status.HTTP_200_OK,
            data=ResponseInfo().format_response(
                data=token_data,
                message="Password Updated",
                status_code=status.HTTP_200_OK,
            ),
        )

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
        # # Uploading resume to S3.
        s3_service = S3Service()
        image_url = s3_service.upload_file(file, content_type, upload_folder)
        user = request.user
        if user.image:
            s3_service.delete_s3_object_by_url(user.image)
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
