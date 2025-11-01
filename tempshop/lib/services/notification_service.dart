import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class NotificationService {
  static String get baseUrl => ApiConfig.authBaseUrl;

  Future<Map<String, dynamic>> getNotifications(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/notifications/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': true, 'data': data is List ? data : []};
      }
      return {'success': false, 'data': []};
    } catch (e) {
      print('Error fetching notifications: $e');
      return {'success': false, 'data': []};
    }
  }

  Future<Map<String, dynamic>> markAsRead(String token, int notificationId) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/notifications/$notificationId/read/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return {'success': true};
      }
      return {'success': false};
    } catch (e) {
      return {'success': false};
    }
  }

  Future<Map<String, dynamic>> markAllAsRead(String token) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/notifications/mark-all-read/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return {'success': true};
      }
      return {'success': false};
    } catch (e) {
      return {'success': false};
    }
  }

  Future<Map<String, dynamic>> deleteNotification(String token, int notificationId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/notifications/$notificationId/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 204) {
        return {'success': true};
      }
      return {'success': false};
    } catch (e) {
      return {'success': false};
    }
  }
}
