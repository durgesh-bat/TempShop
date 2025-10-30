from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import RevokedToken


class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads token from HttpOnly cookie
    Falls back to Authorization header if cookie not present
    Checks if token JTI is revoked
    """
    def authenticate(self, request):
        # Try to get token from cookie first
        raw_token = request.COOKIES.get('access_token')
        # Fall back to Authorization header
        if raw_token is None:
            header = self.get_header(request)
            if header is None:
                return None
            raw_token = self.get_raw_token(header)
        
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        
        # Check if token is revoked
        jti = validated_token.get('jti')
        if jti and RevokedToken.objects.filter(jti=jti).exists():
            raise AuthenticationFailed('Token has been revoked')
        
        return self.get_user(validated_token), validated_token
