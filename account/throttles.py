from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    """Strict throttling for login attempts"""
    rate = '10/hour'


class RegisterRateThrottle(AnonRateThrottle):
    """Throttling for registration"""
    rate = '3/hour'


class OTPRateThrottle(UserRateThrottle):
    """Throttling for OTP requests"""
    rate = '3/hour'


class BurstRateThrottle(UserRateThrottle):
    """General burst protection for authenticated users"""
    rate = '500/minute'


class SustainedRateThrottle(UserRateThrottle):
    """Sustained rate limit for authenticated users"""
    rate = '5000/hour'
