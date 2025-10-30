// Notification store for bell icon notifications
class NotificationStore {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      this.notifications = JSON.parse(stored);
    }
  }

  saveToStorage() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  add(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      link: null,
      ...notification
    };
    this.notifications.unshift(newNotification);
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    this.saveToStorage();
    this.notifyListeners();
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
    this.notifyListeners();
  }

  delete(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  clear() {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  getAll() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }
}

export const notificationStore = new NotificationStore();

// Helper to add notifications
export const addNotification = (type, title, message, data = {}) => {
  notificationStore.add({ type, title, message, ...data });
};
