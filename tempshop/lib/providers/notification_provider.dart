import 'package:flutter/material.dart';
import '../services/notification_service.dart';

class NotificationProvider with ChangeNotifier {
  List<dynamic> _notifications = [];
  int _unreadCount = 0;
  String? _token;

  List<dynamic> get notifications => _notifications;
  int get unreadCount => _unreadCount;

  void setToken(String? token) {
    _token = token;
    if (token != null && token.isNotEmpty) {
      loadNotifications();
    } else {
      _notifications = [];
      _unreadCount = 0;
      notifyListeners();
    }
  }

  Future<void> loadNotifications() async {
    if (_token == null || _token!.isEmpty) {
      _notifications = [];
      _unreadCount = 0;
      notifyListeners();
      return;
    }
    
    final result = await NotificationService().getNotifications(_token!);
    if (result['success']) {
      _notifications = List.from(result['data'] ?? []);
      _unreadCount = _notifications.where((n) => !(n['is_read'] ?? false)).length;
      notifyListeners();
    } else {
      _notifications = [];
      _unreadCount = 0;
      notifyListeners();
    }
  }

  Future<void> markAsRead(int id) async {
    if (_token == null) return;
    
    await NotificationService().markAsRead(_token!, id);
    await loadNotifications();
  }

  Future<void> markAllAsRead() async {
    if (_token == null) return;
    
    await NotificationService().markAllAsRead(_token!);
    await loadNotifications();
  }
}
