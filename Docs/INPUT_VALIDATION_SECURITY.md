# 🔒 Input Validation & Security Guide

## Overview
Comprehensive security measures to protect against malicious input and attacks.

---

## 🛡️ Security Layers

### 1. **Input Validation** (`account/validators.py`)

#### Email Validation
- ✅ Format validation (RFC 5322)
- ✅ Length check (max 254 chars)
- ✅ XSS pattern detection
- ✅ Multiple @ symbol check
- ✅ Suspicious pattern blocking

```python
validate_email("user@example.com")  # ✅ Valid
validate_email("user<script>@test.com")  # ❌ Blocked
```

#### Username Validation
- ✅ Length: 3-30 characters
- ✅ Alphanumeric + underscore + hyphen only
- ✅ Reserved names blocked (admin, root, system)
- ✅ Case-insensitive checks

```python
validate_username("john_doe")  # ✅ Valid
validate_username("admin")  # ❌ Blocked
validate_username("user<script>")  # ❌ Blocked
```

#### Phone Validation
- ✅ Format: +[country][number]
- ✅ Length: 10-15 digits
- ✅ Special characters removed

#### Text Input Validation
- ✅ XSS pattern detection
- ✅ Script tag blocking
- ✅ JavaScript event handler blocking
- ✅ Length limits enforced

#### OTP Validation
- ✅ Exactly 6 digits
- ✅ Numeric only
- ✅ Type checking

---

### 2. **Serializer Validation** (`account/serializers.py`)

#### RegisterSerializer
- ✅ Password strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 digit
- ✅ Username validation
- ✅ Email validation
- ✅ Phone validation

#### AddressSerializer
- ✅ All fields validated for XSS
- ✅ Length limits enforced
- ✅ Postal code format check

#### ReviewSerializer
- ✅ Rating: 1-5 only
- ✅ Comment: Max 1000 chars
- ✅ XSS protection

---

### 3. **View-Level Security** (`account/views.py`)

#### Profile Update
- ✅ Input validation on all fields
- ✅ File upload security:
  - Max size: 5MB
  - Allowed types: JPEG, PNG, GIF, WebP
  - Content-type verification

#### OTP Verification
- ✅ Format validation before processing
- ✅ Rate limiting (3/hour)
- ✅ Expiry check (10 minutes)

---

### 4. **Security Middleware** (`account/security_middleware.py`)

#### Attack Detection
Automatically blocks:

**SQL Injection:**
- `UNION SELECT`
- `OR 1=1`
- `DROP TABLE`
- `INSERT INTO`
- `DELETE FROM`
- `UPDATE SET`

**XSS (Cross-Site Scripting):**
- `<script>` tags
- `javascript:` protocol
- Event handlers (`onerror`, `onclick`, `onload`)
- `<iframe>`, `<object>`, `<embed>`
- `eval()`, `expression()`

**Path Traversal:**
- `../` patterns
- `..\\` patterns
- URL-encoded variants

**Suspicious User Agents:**
- SQLMap
- Nikto
- Nmap
- Burp Suite
- Other scanning tools

#### Security Headers
Automatically adds:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🚨 Attack Examples & Protection

### SQL Injection Attempts
```
❌ BLOCKED: username=admin' OR '1'='1
❌ BLOCKED: email=test@test.com'; DROP TABLE users--
❌ BLOCKED: search=product UNION SELECT * FROM users
```

### XSS Attempts
```
❌ BLOCKED: name=<script>alert('XSS')</script>
❌ BLOCKED: comment=<img src=x onerror=alert(1)>
❌ BLOCKED: description=javascript:alert('XSS')
```

### Path Traversal Attempts
```
❌ BLOCKED: /api/../../etc/passwd
❌ BLOCKED: /api/%2e%2e%2fetc%2fpasswd
```

### File Upload Attacks
```
❌ BLOCKED: file.php (wrong type)
❌ BLOCKED: 10MB.jpg (too large)
❌ BLOCKED: malware.exe (wrong type)
```

---

## ✅ Valid Input Examples

### Registration
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password2": "SecurePass123",
  "phone_number": "+1234567890"
}
```

### Address
```json
{
  "label": "Home",
  "street": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA"
}
```

### Review
```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Great product! Highly recommended."
}
```

---

## 🔧 Configuration

### Rate Limits (settings.py)
```python
'DEFAULT_THROTTLE_RATES': {
    'anon': '1000/hour',      # Anonymous users
    'user': '5000/hour',      # Authenticated users
    'login': '10/hour',       # Login attempts
    'register': '10/hour',    # Registration
    'otp': '5/hour',          # OTP requests
}
```

### File Upload Limits
- Max size: 5MB
- Allowed types: JPEG, PNG, GIF, WebP
- Validated by content-type

---

## 🧪 Testing Security

### Test SQL Injection Protection
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin'\'' OR '\''1'\''='\''1","password":"test"}'
# Expected: 400 Bad Request - SQL injection detected
```

### Test XSS Protection
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"<script>alert(1)</script>","email":"test@test.com"}'
# Expected: 400 Bad Request - XSS detected
```

### Test File Upload
```bash
curl -X PATCH http://localhost:8000/api/auth/profile/ \
  -F "profile_picture=@malware.exe"
# Expected: 400 Bad Request - Invalid file type
```

---

## 📊 Security Checklist

- [x] Input validation on all user inputs
- [x] XSS protection
- [x] SQL injection protection
- [x] Path traversal protection
- [x] File upload validation
- [x] Rate limiting
- [x] Password strength requirements
- [x] Email format validation
- [x] Phone number validation
- [x] OTP format validation
- [x] Security headers
- [x] CSRF protection
- [x] JWT authentication
- [x] HttpOnly cookies
- [x] Suspicious user agent blocking

---

## 🚀 Best Practices

1. **Always validate input** - Never trust user input
2. **Use parameterized queries** - Django ORM does this automatically
3. **Sanitize output** - Escape HTML when displaying user content
4. **Keep dependencies updated** - Regular security updates
5. **Use HTTPS in production** - Encrypt data in transit
6. **Monitor logs** - Watch for attack patterns
7. **Regular security audits** - Test your defenses

---

## 🔗 Related Documentation

- [SECURITY.md](SECURITY.md) - General security guidelines
- [RATE_LIMITING.md](RATE_LIMITING.md) - Rate limiting details
- [JWT_CSRF_AUTH.md](JWT_CSRF_AUTH.md) - Authentication security

---

**Security is a continuous process. Stay vigilant! 🛡️**
