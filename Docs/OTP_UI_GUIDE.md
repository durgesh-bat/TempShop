# OTP Email Verification - UI Implementation

## Overview
Complete UI implementation for OTP-based email verification with automatic redirect flow.

## Components Created

### 1. VerifyOTP Page (`/verify-otp`)
**Location:** `src/pages/VerifyOTP.jsx`

**Features:**
- 6-digit OTP input with auto-formatting
- Send/Resend OTP functionality
- Real-time validation
- Auto-redirect after successful verification
- Skip option for later verification

**UI Elements:**
- Clean, centered card design
- Large OTP input field with tracking
- Loading states for all actions
- Toast notifications for feedback

### 2. Login Flow Enhancement
**Location:** `src/pages/Login.jsx`

**Changes:**
- Detects unverified email on login
- Auto-redirects to `/verify-otp` if email not verified
- Seamless user experience

### 3. Profile Page Banner
**Location:** `src/pages/ProfilePage.jsx`

**Features:**
- Yellow warning banner for unverified users
- "Verify Now" button redirects to OTP page
- Dismissible after verification

## User Flow

```
1. User logs in
   ↓
2. System checks email_verified status
   ↓
3a. If verified → Redirect to profile
3b. If not verified → Redirect to /verify-otp
   ↓
4. User clicks "Send OTP"
   ↓
5. OTP sent to email (valid 10 minutes)
   ↓
6. User enters 6-digit OTP
   ↓
7. System verifies OTP
   ↓
8. Success → Redirect to profile
```

## API Integration

### Auth API (`src/api/authApi.js`)
```javascript
// Send OTP
export const sendOTP = async () => {
  const res = await axiosInstance.post("/auth/send-otp/");
  return res.data;
};

// Verify OTP
export const verifyOTP = async (otp) => {
  const res = await axiosInstance.post("/auth/verify-otp/", { otp });
  return res.data;
};
```

### Redux State (`src/slices/authSlice.js`)
- Added `emailVerified` flag tracking
- Updates on login response

## Routing

### Main Routes (`src/main.jsx`)
```javascript
<Route path="/verify-otp" element={<Layout><VerifyOTP /></Layout>} />
```

## Styling
- Tailwind CSS with dark mode support
- Gradient backgrounds
- Smooth transitions and animations
- Responsive design (mobile-first)

## Toast Notifications
Uses custom toast utility for:
- OTP sent confirmation
- Verification success/failure
- Error messages

## Security Features
- OTP expires after 10 minutes
- 6-digit numeric validation
- Protected route (requires authentication)
- Auto-redirect prevents unauthorized access

## Testing Checklist
- [ ] Login with unverified email redirects to OTP page
- [ ] Send OTP button works and shows toast
- [ ] OTP input accepts only 6 digits
- [ ] Verify button disabled until 6 digits entered
- [ ] Resend OTP works after initial send
- [ ] Invalid OTP shows error
- [ ] Expired OTP shows error
- [ ] Successful verification redirects to profile
- [ ] Profile banner shows for unverified users
- [ ] Banner disappears after verification
- [ ] Dark mode works correctly
- [ ] Mobile responsive design works

## Future Enhancements
- OTP countdown timer (10 minutes)
- Rate limiting on resend
- SMS OTP option
- Remember device feature
