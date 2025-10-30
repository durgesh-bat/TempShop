# 🔐 Enhanced JWT Security

## Overview

JWT security has been enhanced with RS256 asymmetric encryption and JTI (JWT ID) tracking for token revocation.

## 🔑 Key Features

### 1. RS256 Asymmetric Encryption
- **Algorithm:** RSA with SHA-256
- **Key Size:** 2048-bit RSA keys
- **Private Key:** Signs tokens (kept secret)
- **Public Key:** Verifies tokens (can be shared)

### 2. JTI (JWT ID) Tracking
- **Unique ID:** Each token has a unique JTI
- **Revocation:** Tokens can be revoked by JTI
- **Database Tracking:** Revoked tokens stored in database
- **Auto Cleanup:** Expired tokens automatically cleaned

## 🏗️ Implementation

### Files Modified/Created

**New Files:**
- `jwt_private.pem` - RSA private key (DO NOT COMMIT)
- `jwt_public.pem` - RSA public key
- `account/management/commands/cleanup_revoked_tokens.py` - Cleanup command

**Modified Files:**
- `server/settings.py` - RS256 configuration
- `account/models.py` - RevokedToken model
- `account/authentication.py` - JTI validation
- `account/views.py` - Token revocation on logout
- `account/admin.py` - Admin interface for revoked tokens

## 🔒 Security Benefits

✅ **Asymmetric Encryption** - Private key never leaves server  
✅ **Token Revocation** - Logout immediately invalidates tokens  
✅ **Unique Token IDs** - Each token is uniquely identifiable  
✅ **Audit Trail** - Track when tokens were revoked  
✅ **Auto Cleanup** - Expired tokens automatically removed  
✅ **Stronger Security** - RS256 more secure than HS256  

## 📊 How It Works

### Token Generation
```
User Login
    ↓
Generate RSA-signed JWT with JTI
    ↓
Store in HttpOnly Cookie
```

### Token Validation
```
Request with Token
    ↓
Verify RSA Signature
    ↓
Check JTI not in RevokedToken table
    ↓
[Valid] → Process Request
[Revoked] → Return 401 Error
```

### Token Revocation
```
User Logout
    ↓
Extract JTI from Token
    ↓
Add to RevokedToken table
    ↓
Clear Cookies
```

## 🚀 Setup

### 1. Generate Keys (Already Done)
Keys are generated at: `jwt_private.pem` and `jwt_public.pem`

**IMPORTANT:** Never commit `jwt_private.pem` to Git!

### 2. Run Migration
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Test
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Logout (revokes token)
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Cookie: access_token=<token>"
```

## 🔧 Configuration

### JWT Settings (`settings.py`)
```python
SIMPLE_JWT = {
    "ALGORITHM": "RS256",
    "SIGNING_KEY": JWT_PRIVATE_KEY,
    "VERIFYING_KEY": JWT_PUBLIC_KEY,
    "JTI_CLAIM": "jti",
    # ... other settings
}
```

### Token Structure
```json
{
  "token_type": "access",
  "exp": 1640000000,
  "iat": 1639996400,
  "jti": "a1b2c3d4e5f6...",
  "user_id": 1
}
```

## 🗄️ Database Model

### RevokedToken
```python
class RevokedToken(models.Model):
    jti = models.CharField(max_length=255, unique=True, db_index=True)
    user = models.ForeignKey(Client, on_delete=models.CASCADE)
    revoked_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    token_type = models.CharField(max_length=10)
```

## 🧹 Maintenance

### Cleanup Expired Tokens
```bash
python manage.py cleanup_revoked_tokens
```

### Schedule Cleanup (Cron)
```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/TempShop && python manage.py cleanup_revoked_tokens
```

### Manual Cleanup
```python
from django.utils import timezone
from account.models import RevokedToken

RevokedToken.objects.filter(expires_at__lt=timezone.now()).delete()
```

## 📈 Admin Interface

View revoked tokens in Django Admin:
- Navigate to: http://localhost:8000/admin/account/revokedtoken/
- View JTI, user, revocation time, expiry

## 🔍 Monitoring

### Check Revoked Tokens
```python
from account.models import RevokedToken

# Count revoked tokens
RevokedToken.objects.count()

# Recent revocations
RevokedToken.objects.order_by('-revoked_at')[:10]

# User's revoked tokens
RevokedToken.objects.filter(user_id=1)
```

## 🆚 RS256 vs HS256

| Feature | HS256 | RS256 |
|---------|-------|-------|
| Algorithm | Symmetric | Asymmetric |
| Key Type | Single secret | Public/Private pair |
| Security | Good | Better |
| Key Sharing | Cannot share | Public key shareable |
| Performance | Faster | Slightly slower |
| Use Case | Single service | Microservices |

## 🔐 Key Management

### Rotate Keys
```bash
# Generate new keys
python -c "from cryptography.hazmat.primitives.asymmetric import rsa; from cryptography.hazmat.primitives import serialization; from cryptography.hazmat.backends import default_backend; private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048, backend=default_backend()); public_key = private_key.public_key(); private_pem = private_key.private_bytes(encoding=serialization.Encoding.PEM, format=serialization.PrivateFormat.PKCS8, encryption_algorithm=serialization.NoEncryption()); public_pem = public_key.public_bytes(encoding=serialization.Encoding.PEM, format=serialization.PublicFormat.SubjectPublicKeyInfo); open('jwt_private_new.pem', 'wb').write(private_pem); open('jwt_public_new.pem', 'wb').write(public_pem)"

# Backup old keys
mv jwt_private.pem jwt_private_old.pem
mv jwt_public.pem jwt_public_old.pem

# Use new keys
mv jwt_private_new.pem jwt_private.pem
mv jwt_public_new.pem jwt_public.pem

# Restart server
```

### Backup Keys
```bash
# Backup to secure location
cp jwt_private.pem /secure/backup/location/
```

## 🏭 Production Recommendations

1. **Store Keys Securely**
   - Use environment variables or secret management
   - Never commit private key to Git
   - Restrict file permissions: `chmod 600 jwt_private.pem`

2. **Use Redis for Revocation**
   - Faster lookups than database
   - Cache revoked JTIs in Redis

3. **Monitor Token Usage**
   - Track revocation patterns
   - Alert on unusual activity

4. **Regular Key Rotation**
   - Rotate keys every 6-12 months
   - Keep old keys for grace period

## 🧪 Testing

### Test Token Revocation
```python
# In Django shell
from account.models import Client, RevokedToken
from rest_framework_simplejwt.tokens import RefreshToken

user = Client.objects.first()
token = RefreshToken.for_user(user)

# Revoke token
RevokedToken.objects.create(
    jti=token['jti'],
    user=user,
    expires_at=token['exp'],
    token_type='refresh'
)

# Try to use token - should fail
```

## 📚 References

- [JWT.io](https://jwt.io/)
- [RFC 7519 - JWT](https://tools.ietf.org/html/rfc7519)
- [RS256 vs HS256](https://auth0.com/blog/rs256-vs-hs256-whats-the-difference/)

---

**Security Status: Enhanced ✅**

Your JWT implementation now uses industry-standard RS256 encryption with token revocation!
