# 🔔 Notification System Documentation

## Overview

TempShop features a comprehensive notification system that provides real-time feedback for all user actions including cart operations, wishlist management, orders, reviews, authentication, profile updates, and more.

## Features

- ✅ **Categorized Notifications** - Organized by feature (cart, wishlist, orders, etc.)
- 🎨 **Custom Styling** - Beautiful, consistent design with icons
- ⚡ **Real-time Feedback** - Instant notifications for all actions
- 🎯 **Context-aware Messages** - Dynamic messages with product names and details
- 🌈 **Color-coded** - Success (green), Error (red), Info (blue), Warning (yellow)
- ⏱️ **Smart Duration** - Different durations based on importance
- 📱 **Responsive** - Works perfectly on all devices

## Implementation

### Core Files

1. **`/frontend/src/utils/notifications.js`** - Main notification utility
2. **`/frontend/src/components/NotificationToaster.jsx`** - Custom toaster component
3. **`/frontend/src/Layout.jsx`** - Global toaster integration

### Usage

Import the notification utility:

```javascript
import notify from '../utils/notifications';
```

## Notification Categories

### 1. Cart Notifications

```javascript
// Add to cart
notify.cart.added(productName);

// Remove from cart
notify.cart.removed(productName);

// Update cart
notify.cart.updated();

// Clear cart
notify.cart.cleared();

// Cart error
notify.cart.error(message);
```

**Example:**
```javascript
const handleAddToCart = async (productId) => {
  try {
    await dispatch(addToCartThunk({ productId, quantity: 1 })).unwrap();
    notify.cart.added(product.name);
  } catch (err) {
    notify.cart.error(err.message || "Failed to add item");
  }
};
```

### 2. Wishlist Notifications

```javascript
// Add to wishlist
notify.wishlist.added(productName);

// Remove from wishlist
notify.wishlist.removed(productName);

// Wishlist error
notify.wishlist.error(message);
```

**Example:**
```javascript
const handleToggleWishlist = async () => {
  try {
    await toggleWishlist(product.id, isInWishlist);
    if (isInWishlist) {
      notify.wishlist.removed(product.name);
    } else {
      notify.wishlist.added(product.name);
    }
  } catch (err) {
    notify.wishlist.error("Failed to update wishlist");
  }
};
```

### 3. Order Notifications

```javascript
// Order placed
notify.order.placed(orderId);

// Order confirmed
notify.order.confirmed(orderId);

// Order shipped
notify.order.shipped(orderId);

// Order delivered
notify.order.delivered(orderId);

// Order cancelled
notify.order.cancelled(orderId);

// Order error
notify.order.error(message);
```

**Example:**
```javascript
const handlePlaceOrder = async () => {
  try {
    const result = await placeOrder(orderData);
    notify.order.placed(result.order_id);
  } catch (err) {
    notify.order.error("Failed to place order");
  }
};
```

### 4. Review Notifications

```javascript
// Review submitted
notify.review.submitted();

// Review updated
notify.review.updated();

// Review deleted
notify.review.deleted();

// Review error
notify.review.error(message);
```

**Example:**
```javascript
const handleSubmitReview = async (e) => {
  e.preventDefault();
  try {
    await createReview({ product_id: product.id, ...review });
    notify.review.submitted();
    loadReviews();
  } catch (err) {
    notify.review.error("Failed to submit review");
  }
};
```

### 5. Authentication Notifications

```javascript
// Login success
notify.auth.loginSuccess(username);

// Logout success
notify.auth.logoutSuccess();

// Registration success
notify.auth.registerSuccess();

// Verification email sent
notify.auth.verificationSent();

// Email verified
notify.auth.verified();

// Auth error
notify.auth.error(message);
```

**Example:**
```javascript
// In authSlice.js
.addCase(login.fulfilled, (state, action) => {
  state.user = action.payload.user;
  notify.auth.loginSuccess(state.user?.username || 'User');
})
```

### 6. Profile Notifications

```javascript
// Profile updated
notify.profile.updated();

// Avatar updated
notify.profile.avatarUpdated();

// Password changed
notify.profile.passwordChanged();

// Profile error
notify.profile.error(message);
```

**Example:**
```javascript
const handleUpdateProfile = async (formData) => {
  try {
    await dispatch(updateUserProfile(formData)).unwrap();
    notify.profile.updated();
  } catch (err) {
    notify.profile.error("Failed to update profile");
  }
};
```

### 7. Address Notifications

```javascript
// Address added
notify.address.added();

// Address updated
notify.address.updated();

// Address deleted
notify.address.deleted();

// Address error
notify.address.error(message);
```

**Example:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editId) {
      await updateAddress(editId, form);
      notify.address.updated();
    } else {
      await createAddress(form);
      notify.address.added();
    }
  } catch (err) {
    notify.address.error("Failed to save address");
  }
};
```

### 8. Payment Notifications

```javascript
// Payment success
notify.payment.success();

// Payment failed
notify.payment.failed();

// Payment method added
notify.payment.methodAdded();

// Payment method removed
notify.payment.methodRemoved();

// Payment error
notify.payment.error(message);
```

### 9. Wallet Notifications

```javascript
// Wallet credited
notify.wallet.credited(amount);

// Wallet debited
notify.wallet.debited(amount);

// Wallet error
notify.wallet.error(message);
```

### 10. General Notifications

```javascript
// Success
notify.success(message);

// Error
notify.error(message);

// Info
notify.info(message);

// Warning
notify.warning(message);

// Loading
const toastId = notify.loading(message);

// Dismiss
notify.dismiss(toastId);

// Promise-based
notify.promise(promise, {
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error occurred'
});
```

## Customization

### Toaster Configuration

Edit `/frontend/src/components/NotificationToaster.jsx`:

```javascript
<Toaster
  position="top-right"  // Position: top-left, top-center, top-right, etc.
  reverseOrder={false}  // Newest on top
  gutter={8}            // Space between toasts
  toastOptions={{
    duration: 3000,     // Default duration
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '10px',
      padding: '16px',
    },
  }}
/>
```

### Custom Notification

Create a custom notification:

```javascript
import toast from 'react-hot-toast';

toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                   bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">🎉</span>
      <div>
        <h3 className="font-bold">Custom Notification</h3>
        <p className="text-sm text-gray-600">Your custom message here</p>
      </div>
    </div>
  </div>
));
```

## Best Practices

1. **Use Specific Notifications** - Use category-specific notifications instead of generic ones
2. **Include Context** - Pass product names, order IDs, etc. for better UX
3. **Handle Errors** - Always show error notifications in catch blocks
4. **Appropriate Duration** - Use longer durations for important messages
5. **Don't Overuse** - Only notify for significant actions
6. **Test on Mobile** - Ensure notifications work well on small screens

## Examples in Codebase

### Product Page
- Add to cart: `notify.cart.added(product.name)`
- Add to wishlist: `notify.wishlist.added(product.name)`
- Submit review: `notify.review.submitted()`

### Cart Page
- Update quantity: `notify.cart.updated()`
- Remove item: `notify.cart.removed(item.product.name)`

### Profile Page
- Update profile: `notify.profile.updated()`
- Add address: `notify.address.added()`
- Delete review: `notify.review.deleted()`

### Auth Pages
- Login: `notify.auth.loginSuccess(username)`
- Register: `notify.auth.registerSuccess()`
- Logout: `notify.auth.logoutSuccess()`

## Troubleshooting

### Notifications Not Showing

1. Check if `NotificationToaster` is in Layout.jsx
2. Verify import: `import notify from '../utils/notifications'`
3. Check browser console for errors
4. Ensure react-hot-toast is installed: `npm install react-hot-toast`

### Styling Issues

1. Check Tailwind CSS is properly configured
2. Verify dark mode classes are working
3. Test on different screen sizes

### Duplicate Notifications

1. Check for multiple toaster instances
2. Ensure notifications are only called once per action
3. Use loading states to prevent multiple clicks

## Future Enhancements

- [ ] Sound notifications
- [ ] Browser push notifications
- [ ] Notification history/center
- [ ] Persistent notifications for critical actions
- [ ] Notification preferences/settings
- [ ] Email notifications for orders
- [ ] SMS notifications (optional)

## Related Files

- `/frontend/src/utils/notifications.js` - Main utility
- `/frontend/src/components/NotificationToaster.jsx` - Toaster component
- `/frontend/src/Layout.jsx` - Global integration
- `/frontend/src/pages/Product.jsx` - Product notifications
- `/frontend/src/pages/CartPage.jsx` - Cart notifications
- `/frontend/src/slices/authSlice.js` - Auth notifications

## Support

For issues or questions about the notification system:
1. Check this documentation
2. Review example implementations in the codebase
3. Test in browser console
4. Check react-hot-toast documentation: https://react-hot-toast.com/

---

**Made with ❤️ for TempShop**
