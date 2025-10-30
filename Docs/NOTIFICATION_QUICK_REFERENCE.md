# 🔔 Notification System - Quick Reference

## Import

```javascript
import notify from '../utils/notifications';
```

## Quick Reference

### 🛒 Cart
```javascript
notify.cart.added(productName)
notify.cart.removed(productName)
notify.cart.updated()
notify.cart.cleared()
notify.cart.error(message)
```

### ❤️ Wishlist
```javascript
notify.wishlist.added(productName)
notify.wishlist.removed(productName)
notify.wishlist.error(message)
```

### 📦 Orders
```javascript
notify.order.placed(orderId)
notify.order.confirmed(orderId)
notify.order.shipped(orderId)
notify.order.delivered(orderId)
notify.order.cancelled(orderId)
notify.order.error(message)
```

### ⭐ Reviews
```javascript
notify.review.submitted()
notify.review.updated()
notify.review.deleted()
notify.review.error(message)
```

### 🔐 Authentication
```javascript
notify.auth.loginSuccess(username)
notify.auth.logoutSuccess()
notify.auth.registerSuccess()
notify.auth.verificationSent()
notify.auth.verified()
notify.auth.error(message)
```

### 👤 Profile
```javascript
notify.profile.updated()
notify.profile.avatarUpdated()
notify.profile.passwordChanged()
notify.profile.error(message)
```

### 📍 Address
```javascript
notify.address.added()
notify.address.updated()
notify.address.deleted()
notify.address.error(message)
```

### 💳 Payment
```javascript
notify.payment.success()
notify.payment.failed()
notify.payment.methodAdded()
notify.payment.methodRemoved()
notify.payment.error(message)
```

### 💰 Wallet
```javascript
notify.wallet.credited(amount)
notify.wallet.debited(amount)
notify.wallet.error(message)
```

### 🔧 General
```javascript
notify.success(message)
notify.error(message)
notify.info(message)
notify.warning(message)
notify.loading(message)
notify.dismiss(toastId)
notify.promise(promise, { loading, success, error })
```

## Common Patterns

### Basic Action
```javascript
try {
  await someAction();
  notify.success("Action completed!");
} catch (err) {
  notify.error(err.message);
}
```

### With Product Name
```javascript
try {
  await addToCart(productId);
  notify.cart.added(product.name);
} catch (err) {
  notify.cart.error("Failed to add item");
}
```

### Promise-based
```javascript
notify.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Failed to save'
  }
);
```

### Loading State
```javascript
const toastId = notify.loading("Processing...");
try {
  await longRunningTask();
  notify.dismiss(toastId);
  notify.success("Done!");
} catch (err) {
  notify.dismiss(toastId);
  notify.error("Failed!");
}
```

## Icons Reference

- 🛒 Cart
- ❤️ Wishlist
- 📦 Orders
- ⭐ Reviews
- 🔐 Auth
- 👤 Profile
- 📍 Address
- 💳 Payment
- 💰 Wallet
- ✅ Success
- ❌ Error
- ℹ️ Info
- ⚠️ Warning

---

For detailed documentation, see [NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md)
