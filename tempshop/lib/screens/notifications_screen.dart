import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/notification_service.dart';
import '../providers/auth_provider.dart';
import '../providers/notification_provider.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<dynamic> _notifications = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    if (auth.token == null) return;

    setState(() => _loading = true);
    await notificationProvider.loadNotifications();
    if (!mounted) return;
    
    setState(() {
      _notifications = notificationProvider.notifications;
      _loading = false;
    });
  }

  Future<void> _markAsRead(int id) async {
    final notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    await notificationProvider.markAsRead(id);
    _loadNotifications();
  }

  Future<void> _markAllAsRead() async {
    final notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    await notificationProvider.markAllAsRead();
    _loadNotifications();
  }

  Future<void> _deleteNotification(int id) async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    await NotificationService().deleteNotification(auth.token!, id);
    _loadNotifications();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (_notifications.any((n) => !n['is_read']))
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.notifications_off, size: 80, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('No notifications', style: TextStyle(fontSize: 18, color: Colors.grey)),
                    ],
                  ),
                )
              : ListView.builder(
                  itemCount: _notifications.length,
                  itemBuilder: (_, i) {
                    final notif = _notifications[i];
                    final isRead = notif['is_read'] ?? false;
                    return Dismissible(
                      key: Key(notif['id'].toString()),
                      background: Container(color: Colors.red, child: const Icon(Icons.delete, color: Colors.white)),
                      onDismissed: (_) => _deleteNotification(notif['id']),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: isRead ? Colors.grey[300] : Colors.blue[100],
                          child: Icon(
                            Icons.notifications,
                            color: isRead ? Colors.grey : Colors.blue,
                          ),
                        ),
                        title: Text(
                          notif['title'] ?? 'Notification',
                          style: TextStyle(fontWeight: isRead ? FontWeight.normal : FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(notif['message'] ?? ''),
                            const SizedBox(height: 4),
                            Text(
                              notif['created_at'] ?? '',
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                        onTap: isRead ? null : () => _markAsRead(notif['id']),
                      ),
                    );
                  },
                ),
    );
  }
}
