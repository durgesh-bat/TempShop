import jwt
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import User
from django.http import JsonResponse


class JWTAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        """
        This middleware checks Authorization header for JWT access token.
        If expired, it tries to refresh using refresh token (from headers or cookies).
        """

        auth_header = request.headers.get("Authorization")
        refresh_token = request.headers.get("X-Refresh-Token") or request.COOKIES.get("refresh")

        if not auth_header:
            return None  # no token, proceed (unprotected route)

        if not auth_header.startswith("Bearer "):
            return JsonResponse({"detail": "Invalid Authorization header."}, status=400)

        access_token = auth_header.split(" ")[1]

        try:
            # ✅ Verify Access Token
            decoded = AccessToken(access_token)
            
            user_id = decoded.get("user_id")
            user = User.objects.filter(id=user_id).first()
            if not user:
                return JsonResponse({"detail": "User not found."}, status=401)

            # Attach user to request
            request.user = user
            return None  # valid token

        except TokenError as e:
            # ⏰ Token expired or invalid → Try refresh
            if refresh_token:
                try:
                    refresh = RefreshToken(refresh_token)
                    user_id = refresh.get("user_id")
                    user = User.objects.filter(id=user_id).first()
                    if not user:
                        return JsonResponse({"detail": "User not found."}, status=401)

                    # Generate new tokens
                    new_refresh = RefreshToken.for_user(user)
                    new_access = new_refresh.access_token

                    response = JsonResponse({
                        "detail": "Access token refreshed.",
                        "access": str(new_access),
                        "refresh": str(new_refresh),
                    })
                    response.status_code = 200
                    return response

                except TokenError:
                    return JsonResponse({"detail": "Invalid or expired refresh token."}, status=401)

            return JsonResponse({"detail": "Invalid or expired access token."}, status=401)
