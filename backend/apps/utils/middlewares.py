from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from jwt import decode as jwt_decode
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.models import TokenUser
from rest_framework_simplejwt.tokens import UntypedToken
from urllib.parse import parse_qs

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import close_old_connections


@database_sync_to_async
def get_user(validated_token):
    try:
        return get_user_model().objects.get(id=validated_token["user_id"])

    except TokenUser.DoesNotExist:
        return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):
    """
    Custom token auth middleware
    """

    def __init__(self, inner):
        # Store the ASGI application we were passed
        self.inner = inner

    async def __call__(self, scope, *args, **kwargs):
        # Close old database connections to prevent usage of timed out connections
        close_old_connections()
        token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
        
        # Try to authenticate the user
        try:
            # This will automatically validate the token and raise an error if token is invalid
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            return None
        else:
            
            decoded_data = jwt_decode(
                token, settings.SECRET_KEY, algorithms=["HS256"])

            token_user = await get_user(validated_token=decoded_data)
            scope["user"] = token_user

        return await super().__call__(scope, *args, **kwargs)


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))
