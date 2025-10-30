# 🔄 Authentication Flow Diagrams

## 1. Login Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Django    │
│  (React)    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. GET /api/auth/csrf/                         │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │  2. Set-Cookie: csrftoken=abc123                │
       │<─────────────────────────────────────────────────│
       │                                                  │
       │  3. POST /api/auth/login/                       │
       │     Headers: X-CSRFToken: abc123                │
       │     Body: {username, password}                  │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │                                    ┌─────────────┴─────────────┐
       │                                    │ Validate credentials      │
       │                                    │ Generate JWT tokens       │
       │                                    └─────────────┬─────────────┘
       │                                                  │
       │  4. Set-Cookie: access_token=xyz (HttpOnly)     │
       │     Set-Cookie: refresh_token=def (HttpOnly)    │
       │     Body: {user: {...}, message: "Success"}     │
       │<─────────────────────────────────────────────────│
       │                                                  │
       │  ✓ User logged in                               │
       │                                                  │
```

---

## 2. Authenticated Request Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Django    │
│  (React)    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. GET /api/auth/profile/                      │
       │     Cookie: access_token=xyz                    │
       │     Cookie: refresh_token=def                   │
       │     Cookie: csrftoken=abc                       │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │                                    ┌─────────────┴─────────────┐
       │                                    │ Read JWT from cookie      │
       │                                    │ Validate token            │
       │                                    │ Get user from token       │
       │                                    └─────────────┬─────────────┘
       │                                                  │
       │  2. 200 OK                                      │
       │     Body: {id, username, email, ...}            │
       │<─────────────────────────────────────────────────│
       │                                                  │
```

---

## 3. Token Refresh Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Django    │
│  (React)    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. GET /api/some-endpoint/                     │
       │     Cookie: access_token=expired                │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │                                    ┌─────────────┴─────────────┐
       │                                    │ Token validation fails    │
       │                                    └─────────────┬─────────────┘
       │                                                  │
       │  2. 401 Unauthorized                            │
       │<─────────────────────────────────────────────────│
       │                                                  │
┌──────┴──────────────────────────────────┐              │
│ Axios Interceptor catches 401           │              │
│ Automatically calls refresh endpoint    │              │
└──────┬──────────────────────────────────┘              │
       │                                                  │
       │  3. POST /api/auth/token/refresh/               │
       │     Cookie: refresh_token=def                   │
       │     Headers: X-CSRFToken: abc                   │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │                                    ┌─────────────┴─────────────┐
       │                                    │ Validate refresh token    │
       │                                    │ Generate new access token │
       │                                    └─────────────┬─────────────┘
       │                                                  │
       │  4. Set-Cookie: access_token=new (HttpOnly)     │
       │     200 OK                                      │
       │<─────────────────────────────────────────────────│
       │                                                  │
┌──────┴──────────────────────────────────┐              │
│ Axios Interceptor retries original     │              │
│ request with new token                  │              │
└──────┬──────────────────────────────────┘              │
       │                                                  │
       │  5. GET /api/some-endpoint/                     │
       │     Cookie: access_token=new                    │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │  6. 200 OK                                      │
       │     Body: {...}                                 │
       │<─────────────────────────────────────────────────│
       │                                                  │
       │  ✓ Request succeeded                            │
       │                                                  │
```

---

## 4. Logout Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Django    │
│  (React)    │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /api/auth/logout/                      │
       │     Cookie: access_token=xyz                    │
       │     Cookie: refresh_token=def                   │
       │     Headers: X-CSRFToken: abc                   │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │                                    ┌─────────────┴─────────────┐
       │                                    │ Validate CSRF token       │
       │                                    │ Delete all cookies        │
       │                                    └─────────────┬─────────────┘
       │                                                  │
       │  2. Set-Cookie: access_token=; Max-Age=0        │
       │     Set-Cookie: refresh_token=; Max-Age=0       │
       │     Set-Cookie: csrftoken=; Max-Age=0           │
       │     200 OK                                      │
       │<─────────────────────────────────────────────────│
       │                                                  │
┌──────┴──────────────────────────────────┐              │
│ Redux: dispatch(logout())               │              │
│ Clear user state                        │              │
│ Redirect to /login                      │              │
└──────┬──────────────────────────────────┘              │
       │                                                  │
       │  ✓ User logged out                              │
       │                                                  │
```

---

## 5. CSRF Protection Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Attacker  │                                    │   Django    │
│   Website   │                                    │   Backend   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  1. POST /api/auth/logout/                      │
       │     Cookie: access_token=stolen                 │
       │     (No X-CSRFToken header)                     │
       │─────────────────────────────────────────────────>│
       │                                                  │
       │                                    ┌─────────────┴─────────────┐
       │                                    │ Check CSRF token          │
       │                                    │ Token missing!            │
       │                                    └─────────────┬─────────────┘
       │                                                  │
       │  2. 403 Forbidden                               │
       │     "CSRF token missing or incorrect"           │
       │<─────────────────────────────────────────────────│
       │                                                  │
       │  ✗ Attack blocked!                              │
       │                                                  │
```

---

## 6. XSS Protection

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │  Malicious  │
│  (React)    │                                    │   Script    │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  Malicious script injected via XSS              │
       │<─────────────────────────────────────────────────│
       │                                                  │
┌──────┴──────────────────────────────────┐              │
│ Script tries to steal tokens:           │              │
│ const token = document.cookie;          │              │
└──────┬──────────────────────────────────┘              │
       │                                                  │
       │  Returns: "csrftoken=abc123"                    │
       │  (No access_token or refresh_token!)            │
       │                                                  │
       │  ✓ Tokens protected by HttpOnly flag            │
       │                                                  │
```

---

## 7. Complete Security Model

```
┌────────────────────────────────────────────────────────────────┐
│                         Browser (React)                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Redux Store (User State)                 │    │
│  │  - user: { id, username, email, ... }                │    │
│  │  - isAuthenticated: true/false                       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Axios Instance                           │    │
│  │  - withCredentials: true                             │    │
│  │  - Auto-attach CSRF token                            │    │
│  │  - Auto-refresh on 401                               │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Browser Cookies                        │     │
│  │  ✓ access_token (HttpOnly, SameSite=Lax)            │     │
│  │  ✓ refresh_token (HttpOnly, SameSite=Lax)           │    │
│  │  ✓ csrftoken (Readable by JS)                       │    │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (Production)
                              │ HTTP (Development)
                              │
┌──────────────────────────────────────────────────────────────┐
│                      Django Backend                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐    │
│  │         JWTCookieAuthentication                      │    │
│  │  1. Read JWT from cookie                             │    │
│  │  2. Validate token                                   │    │
│  │  3. Get user from token                              │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         CSRF Middleware                              │    │
│  │  1. Check X-CSRFToken header                         │    │
│  │  2. Compare with cookie                              │    │
│  │  3. Reject if mismatch                               │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         CORS Middleware                              │    │
│  │  - Allow credentials                                 │    │
│  │  - Check origin                                      │    │
│  │  - Set appropriate headers                           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Security Guarantees

### ✅ XSS Protection
- Tokens in HttpOnly cookies
- JavaScript cannot access tokens
- Even if XSS occurs, tokens are safe

### ✅ CSRF Protection
- CSRF token required for state changes
- SameSite cookie attribute
- Origin validation

### ✅ Token Security
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (7 days)
- Automatic refresh on expiry

### ✅ Transport Security
- HTTPS in production
- Secure cookie flag
- Encrypted communication

---

## Attack Scenarios & Defenses

| Attack | Defense | Status |
|--------|---------|--------|
| XSS Token Theft | HttpOnly cookies | ✅ Protected |
| CSRF Attack | CSRF token + SameSite | ✅ Protected |
| Token Replay | Short expiry + refresh | ✅ Mitigated |
| Man-in-Middle | HTTPS + Secure flag | ✅ Protected |
| Session Fixation | Token rotation | ✅ Protected |

---

**For implementation details, see [JWT_CSRF_AUTH.md](JWT_CSRF_AUTH.md)**
