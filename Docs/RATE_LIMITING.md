# 🛡️ Rate Limiting & Throttling

## Overview

Rate limiting and throttling have been implemented to prevent abuse, brute-force attacks, and DoS attacks on the TempShop API.

## Throttle Classes

### 1. **LoginRateThrottle**
- **Rate:** 5 requests per hour
- **Applied to:** Login endpoint
- **Purpose:** Prevent brute-force password attacks

### 2. **RegisterRateThrottle**
- **Rate:** 3 requests per hour
- **Applied to:** Registration endpoint
- **Purpose:** Prevent spam account creation

### 3. **OTPRateThrottle**
- **Rate:** 3 requests per hour
- **Applied to:** OTP send/verify endpoints
- **Purpose:** Prevent OTP spam and abuse

### 4. **BurstRateThrottle**
- **Rate:** 100 requests per minute
- **Applied to:** All authenticated endpoints (default)
- **Purpose:** Prevent rapid-fire request abuse

### 5. **SustainedRateThrottle**
- **Rate:** 1000 requests per hour
- **Applied to:** All authenticated endpoints (default)
- **Purpose:** Prevent sustained high-volume abuse

## Protected Endpoints

### Authentication Endpoints
- `POST /api/auth/register/` - 3/hour
- `POST /api/auth/login/` - 5/hour
- `POST /api/auth/send-otp/` - 3/hour
- `POST /api/auth/verify-otp/` - 3/hour

### General Endpoints
- All authenticated endpoints - 100/min + 1000/hour
- Anonymous endpoints - 100/hour

## Error Response

When rate limit is exceeded:

```json
{
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

**HTTP Status:** `429 Too Many Requests`

## Configuration

Located in `server/settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'account.throttles.BurstRateThrottle',
        'account.throttles.SustainedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'burst': '100/minute',
        'sustained': '1000/hour',
        'login': '5/hour',
        'register': '3/hour',
        'otp': '3/hour',
    },
}
```

## Customization

### Adjust Rate Limits

Edit `server/settings.py`:

```python
'DEFAULT_THROTTLE_RATES': {
    'login': '10/hour',  # Increase login attempts
    'register': '5/hour',  # Increase registration
}
```

### Add Custom Throttle

1. Create in `account/throttles.py`:

```python
from rest_framework.throttling import UserRateThrottle

class CustomThrottle(UserRateThrottle):
    rate = '50/hour'
```

2. Apply to view:

```python
from .throttles import CustomThrottle

@throttle_classes([CustomThrottle])
def my_view(request):
    pass
```

## Testing

### Test Rate Limiting

```bash
# Test login throttling (should fail after 5 attempts)
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}'
done
```

### Check Headers

Response includes rate limit info:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1640000000
```

## Best Practices

1. **Monitor Logs** - Track throttled requests
2. **Adjust Limits** - Based on legitimate usage patterns
3. **Whitelist IPs** - For trusted services (if needed)
4. **Cache Backend** - Use Redis for production

## Production Setup

### Use Redis for Throttling

1. Install Redis:
```bash
pip install django-redis
```

2. Configure in `settings.py`:
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## Security Benefits

✅ **Prevents brute-force attacks** on login  
✅ **Stops spam registrations**  
✅ **Blocks DoS attempts**  
✅ **Limits OTP abuse**  
✅ **Protects API resources**  
✅ **Reduces server load**

## Monitoring

Track throttled requests in logs:

```python
# Add to settings.py
LOGGING = {
    'loggers': {
        'django.request': {
            'handlers': ['file'],
            'level': 'WARNING',
        },
    },
}
```

---

**Made with ❤️ for TempShop Security**
