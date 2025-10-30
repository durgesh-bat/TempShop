import toast from 'react-hot-toast';
import { addNotification } from './notificationStore';

// Enhanced notification system with icons and custom styling
export const notify = {
  // Cart notifications
  cart: {
    added: (productName, productId) => {
      toast.success(`${productName} added to cart!`, { 
        duration: 3000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '🛒'
      });
      addNotification('cart', 'Added to Cart', `${productName} has been added to your cart. Click to view cart.`, { link: '/cart' });
    },
    removed: (productName) => {
      toast.success(`${productName} removed from cart`, { 
        duration: 2500,
        style: { background: '#6b7280', color: '#fff', fontWeight: '500' },
        icon: '🗑️'
      });
      addNotification('cart', 'Removed from Cart', `${productName} has been removed from your cart.`, { link: '/cart' });
    },
    updated: () => toast.success('Cart updated', { 
      duration: 2000,
      style: { background: '#10b981', color: '#fff', fontWeight: '500' },
      icon: '✅'
    }),
    cleared: () => toast.success(
      'Cart cleared',
      { duration: 2000, icon: '🧹' }
    ),
    error: (message) => toast.error(message, { 
      duration: 4000,
      style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
      icon: '❌'
    })
  },

  // Wishlist notifications
  wishlist: {
    added: (productName, productId) => {
      toast.success(`${productName} added to wishlist!`, { 
        duration: 3000,
        style: { background: '#ec4899', color: '#fff', fontWeight: '500' },
        icon: '❤️'
      });
      addNotification('wishlist', 'Added to Wishlist', `${productName} has been added to your wishlist. Click to view.`, { link: '/user-profile' });
    },
    removed: (productName) => {
      toast.success(`${productName} removed from wishlist`, { 
        duration: 2500,
        style: { background: '#6b7280', color: '#fff', fontWeight: '500' },
        icon: '💔'
      });
      addNotification('wishlist', 'Removed from Wishlist', `${productName} has been removed from your wishlist.`, { link: '/user-profile' });
    },
    error: (message) => toast.error(message, { 
      duration: 4000,
      style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
      icon: '❌'
    })
  },

  // Order notifications
  order: {
    placed: (orderId) => {
      toast.success(`Order #${orderId} placed successfully!`, { 
        duration: 5000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '🎉'
      });
      addNotification('order', 'Order Placed', `Your order #${orderId} has been placed successfully. Click to view orders.`, { link: '/orders' });
    },
    confirmed: (orderId) => toast.success(
      `Order #${orderId} confirmed`,
      { duration: 4000, icon: '📦' }
    ),
    shipped: (orderId) => {
      toast.success(`Order #${orderId} has been shipped!`, { 
        duration: 4000,
        style: { background: '#3b82f6', color: '#fff', fontWeight: '500' },
        icon: '📦'
      });
      addNotification('order', 'Order Shipped', `Your order #${orderId} has been shipped. Click to track.`, { link: '/orders' });
    },
    delivered: (orderId) => {
      toast.success(`Order #${orderId} delivered!`, { 
        duration: 4000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '🎁'
      });
      addNotification('order', 'Order Delivered', `Your order #${orderId} has been delivered. Click to view.`, { link: '/orders' });
    },
    cancelled: (orderId) => toast.error(
      `Order #${orderId} cancelled`,
      { duration: 4000, icon: '❌' }
    ),
    error: (message) => toast.error(
      `Order Error: ${message}`,
      { duration: 4000, icon: '❌' }
    )
  },

  // Review notifications
  review: {
    submitted: () => {
      toast.success('Review submitted successfully!', { 
        duration: 3000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '⭐'
      });
      addNotification('review', 'Review Submitted', 'Your review has been submitted successfully. Thank you!', { link: '/user-profile' });
    },
    updated: () => toast.success(
      'Review updated',
      { duration: 2500, icon: '✅' }
    ),
    deleted: () => toast.success(
      'Review deleted',
      { duration: 2500, icon: '🗑️' }
    ),
    error: (message) => toast.error(
      `Review Error: ${message}`,
      { duration: 4000, icon: '❌' }
    )
  },

  // Auth notifications
  auth: {
    loginSuccess: (username) => {
      toast.success(`Welcome back, ${username}!`, { 
        duration: 3000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '👋'
      });
      addNotification('auth', 'Login Successful', `Welcome back, ${username}! Click to view your profile.`, { link: '/profile' });
    },
    logoutSuccess: () => toast.success(
      'Logged out successfully',
      { duration: 2500, icon: '👋' }
    ),
    registerSuccess: () => toast.success(
      '🎉 Account created successfully!',
      { duration: 3000, icon: '✅' }
    ),
    verificationSent: () => toast.success(
      '📧 Verification email sent!',
      { duration: 3000, icon: '✉️' }
    ),
    verified: () => toast.success(
      '✅ Email verified successfully!',
      { duration: 3000, icon: '🎉' }
    ),
    error: (message) => toast.error(message, { 
      duration: 4000,
      style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
      icon: '❌'
    })
  },

  // Profile notifications
  profile: {
    updated: () => {
      toast.success('Profile updated successfully!', { 
        duration: 3000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '👤'
      });
      addNotification('profile', 'Profile Updated', 'Your profile has been updated successfully.', { link: '/profile' });
    },
    avatarUpdated: () => toast.success(
      'Profile picture updated',
      { duration: 2500, icon: '📸' }
    ),
    passwordChanged: () => toast.success(
      '🔒 Password changed successfully!',
      { duration: 3000, icon: '✅' }
    ),
    error: (message) => toast.error(message, { 
      duration: 4000,
      style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
      icon: '❌'
    })
  },

  // Address notifications
  address: {
    added: () => {
      toast.success('Address added successfully!', { 
        duration: 3000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '📍'
      });
      addNotification('address', 'Address Added', 'New address has been added to your account.', { link: '/user-profile' });
    },
    updated: () => toast.success(
      'Address updated',
      { duration: 2500, icon: '✅' }
    ),
    deleted: () => toast.success(
      'Address deleted',
      { duration: 2500, icon: '🗑️' }
    ),
    error: (message) => toast.error(message, { 
      duration: 4000,
      style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
      icon: '❌'
    })
  },

  // Payment notifications
  payment: {
    success: () => {
      toast.success('Payment successful!', { 
        duration: 4000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '💳'
      });
      addNotification('payment', 'Payment Successful', 'Your payment has been processed successfully. Click to view orders.', { link: '/orders' });
    },
    failed: () => toast.error(
      '💳 Payment failed. Please try again.',
      { duration: 4000, icon: '❌' }
    ),
    methodAdded: () => toast.success(
      'Payment method added',
      { duration: 2500, icon: '💳' }
    ),
    methodRemoved: () => toast.success(
      'Payment method removed',
      { duration: 2500, icon: '🗑️' }
    ),
    error: (message) => toast.error(message, { 
      duration: 4000,
      style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
      icon: '❌'
    })
  },

  // Wallet notifications
  wallet: {
    credited: (amount) => {
      toast.success(`₹${amount} credited to wallet!`, { 
        duration: 3000,
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        icon: '💰'
      });
      addNotification('wallet', 'Wallet Credited', `₹${amount} has been credited to your wallet. Click to view balance.`, { link: '/user-profile' });
    },
    debited: (amount) => {
      toast.success(`₹${amount} debited from wallet`, { 
        duration: 3000,
        style: { background: '#6b7280', color: '#fff', fontWeight: '500' },
        icon: '💸'
      });
      addNotification('wallet', 'Wallet Debited', `₹${amount} has been debited from your wallet.`, { link: '/user-profile' });
    },
    error: (message) => toast.error(message, { 
      duration: 4000,
      style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
      icon: '❌'
    })
  },

  // General notifications
  success: (message) => toast.success(message, { 
    duration: 3000,
    style: { background: '#10b981', color: '#fff', fontWeight: '500' },
    icon: '✅'
  }),
  error: (message) => toast.error(message, { 
    duration: 4000,
    style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
    icon: '❌'
  }),
  info: (message) => toast(message, { 
    duration: 3000,
    style: { background: '#3b82f6', color: '#fff', fontWeight: '500' },
    icon: 'ℹ️'
  }),
  warning: (message) => toast(message, { 
    duration: 3500,
    style: { background: '#f59e0b', color: '#fff', fontWeight: '500' },
    icon: '⚠️'
  }),
  loading: (message) => toast.loading(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  
  // Promise-based notification
  promise: (promise, messages) => toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Error occurred',
  })
};

export default notify;
