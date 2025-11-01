# Flutter App - API Testing Guide

## Backend API Base URL
```
https://7743105dc1df.ngrok-free.app/api/auth
```

## 1. Register Endpoint

**URL:** `POST /api/auth/register/`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234",
  "password2": "Test1234"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit

**Success Response (201):**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "",
    "last_name": "",
    "phone_number": null,
    "profile_picture": null,
    "date_joined": "2025-01-20T10:30:00Z",
    "is_email_verified": false
  },
  "message": "Registration successful! Please check your email to verify your account.",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error Response (400):**
```json
{
  "username": ["A user with that username already exists."],
  "email": ["This field must be unique."],
  "password": ["Password must contain at least one uppercase letter"],
  "non_field_errors": ["Passwords do not match."]
}
```

## 2. Login Endpoint

**URL:** `POST /api/auth/login/`

**Request Body:**
```json
{
  "username": "testuser",
  "password": "Test1234"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "",
    "last_name": "",
    "phone_number": null,
    "profile_picture": null,
    "date_joined": "2025-01-20T10:30:00Z",
    "is_email_verified": false
  },
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error Response (401):**
```json
{
  "detail": "Invalid credentials"
}
```

## Testing with cURL

### Register:
```bash
curl -X POST https://7743105dc1df.ngrok-free.app/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234",
    "password2": "Test1234"
  }'
```

### Login:
```bash
curl -X POST https://7743105dc1df.ngrok-free.app/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test1234"
  }'
```

## Flutter App Changes Made

### 1. Fixed `auth_service.dart`:
- ✅ Proper error message parsing from backend
- ✅ Handle both `detail` and `message` fields
- ✅ Parse serializer validation errors (username, email, password fields)
- ✅ Handle list and string error formats

### 2. Fixed `register_screen.dart`:
- ✅ Password validation matches backend (8+ chars, uppercase, lowercase, digit)
- ✅ Better error display

## Common Issues & Solutions

### Issue 1: "Password must be at least 8 characters"
**Solution:** Use password with 8+ characters, e.g., `Test1234`

### Issue 2: "Password must contain at least one uppercase letter"
**Solution:** Include uppercase letter in password, e.g., `Test1234`

### Issue 3: "A user with that username already exists"
**Solution:** Use a different username

### Issue 4: "Invalid credentials"
**Solution:** Check username and password are correct

## 3. Cart Endpoints

### Get Cart
**URL:** `GET /api/cart/`
**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
```json
{
  "items": [
    {
      "product": {
        "id": 1,
        "name": "Product Name",
        "price": "99.99",
        "primary_image": "https://..."
      },
      "quantity": 2
    }
  ]
}
```

### Add to Cart
**URL:** `POST /api/cart/{product_id}/`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "quantity": 1
}
```

### Update Cart Item
**URL:** `PATCH /api/cart/{product_id}/`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
**URL:** `DELETE /api/cart/{product_id}/`
**Headers:** `Authorization: Bearer {token}`

## 4. Wishlist Endpoints

### Get Wishlist
**URL:** `GET /api/auth/wishlist/`
**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "product": {
      "id": 1,
      "name": "Product Name",
      "price": "99.99"
    },
    "added_at": "2025-01-20T10:30:00Z"
  }
]
```

### Add to Wishlist
**URL:** `POST /api/auth/wishlist/`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "product_id": 1
}
```

### Remove from Wishlist
**URL:** `DELETE /api/auth/wishlist/product/{product_id}/`
**Headers:** `Authorization: Bearer {token}`

## Flutter App Changes Made

### 3. Fixed `cart_provider.dart`:
- ✅ Cleaned up console logs
- ✅ Proper error handling
- ✅ Correct API endpoints
- ✅ Handles empty cart response

### 4. Fixed `wishlist_provider.dart`:
- ✅ Changed base URL to `/api/auth` (wishlist is under auth)
- ✅ Proper status code handling (200, 201, 204)
- ✅ Optimistic UI updates only on success
- ✅ Better error handling

## Next Steps

1. Run the Flutter app: `flutter run`
2. Test registration with valid credentials
3. Test login with registered credentials
4. Verify token is stored in AuthProvider
5. Test adding products to cart
6. Test adding products to wishlist
7. Verify cart/wishlist sync after login
