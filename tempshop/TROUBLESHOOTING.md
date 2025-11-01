# TempShop Flutter App - Troubleshooting Guide

## Current Issues & Solutions

### 1. Token Authentication (401 Unauthorized)

**Problem:** API calls return 401 Unauthorized error

**Debug Steps:**
1. After login, check console for: `Login: stored token length=...`
2. When adding address, check console for: `Token value: ...`
3. Verify token is not null or empty

**Solution:**
- Token should be returned in login response as `access_token`
- Token is stored in AuthProvider and SharedPreferences
- Token is passed to cart/wishlist providers via ProxyProvider

**Check:**
```dart
// In login_screen.dart after successful login
print('Token received: ${result['token']}');
```

### 2. Cart/Wishlist Sync Error

**Problem:** `type '_Map<String, dynamic>' is not a subtype of type 'List<dynamic>'`

**Cause:** Backend returns empty object `{}` instead of empty array `[]`

**Fixed:** Added type checking in syncWithBackend methods

### 3. Address Creation Fails

**Problem:** Cannot create address, returns 401

**Debug Output Needed:**
```
Creating address with token length: XXX
Token value: eyJ...
Request headers: {Content-Type: application/json, Authorization: Bearer eyJ...}
Address creation response: 401
Response body: {"detail":"..."}
```

**Possible Causes:**
1. Token not stored after login
2. Token format incorrect
3. Token expired
4. Backend authentication middleware issue

**Solution Steps:**

#### Step 1: Verify Login Response
Check if backend returns `access_token` in response:
```json
{
  "user": {...},
  "message": "Login successful",
  "access_token": "eyJ..."
}
```

#### Step 2: Verify Token Storage
After login, check:
```dart
final auth = Provider.of<AuthProvider>(context, listen: false);
print('Auth token: ${auth.token}');
print('Is authenticated: ${auth.isAuthenticated}');
```

#### Step 3: Test Token Manually
Use Postman/curl to test the token:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://7743105dc1df.ngrok-free.app/api/auth/addresses/
```

## Quick Fixes

### Force Token Refresh
```dart
// In addresses_screen.dart before creating address
final auth = Provider.of<AuthProvider>(context, listen: false);
await auth.checkAuthStatus(); // Reload token from storage
print('Token after refresh: ${auth.token}');
```

### Manual Token Test
```dart
// Add this button in profile screen for testing
ElevatedButton(
  onPressed: () async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final result = await OrderService().getAddresses(auth.token!);
    print('Address fetch result: $result');
  },
  child: Text('Test Token'),
)
```

## Backend Verification

### Check Django Settings
Ensure these are configured:
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'account.authentication.JWTCookieAuthentication',
    ],
}

# JWTCookieAuthentication should accept Authorization header
```

### Check Login View
Verify login returns access_token:
```python
# account/views.py
response_data = {
    "user": ClientSerializer(user).data,
    "message": "Login successful",
    "access_token": tokens['access']  # This must be present
}
```

## Testing Checklist

- [ ] Login successful, token printed in console
- [ ] Token length > 100 characters
- [ ] Token stored in SharedPreferences
- [ ] AuthProvider.token is not null
- [ ] Cart/Wishlist sync without errors
- [ ] Address list loads (even if empty)
- [ ] Address creation shows detailed error in console

## Console Commands

### View all Flutter logs
```bash
flutter run --verbose
```

### Filter for specific logs
```bash
flutter run | grep -E "(flutter|Token|Address|Login)"
```

### Clear and restart
```bash
flutter clean
flutter pub get
flutter run
```

## Common Errors

### "Getting token: null"
- User not logged in
- Token not stored after login
- SharedPreferences not initialized

### "RangeError: Invalid value"
- Token substring issue (FIXED)
- Check token length before substring

### "setState() called after dispose"
- Async operation completed after widget disposed (FIXED)
- Added mounted checks

### "type '_Map' is not a subtype of type 'List'"
- Backend returns {} instead of [] (FIXED)
- Added type checking in sync methods

## Next Steps

1. Run app with `flutter run --verbose`
2. Login with test account
3. Check console for token details
4. Try to add address
5. Share complete console output from login to address creation
6. Include any error messages from Django server

## Contact Points

- Flutter logs: Check Android Studio/VS Code Debug Console
- Django logs: Check terminal running `python manage.py runserver`
- Network logs: Use Flutter DevTools Network tab
