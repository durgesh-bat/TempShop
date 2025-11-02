import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class AuthService {
  static String get baseUrl => ApiConfig.authBaseUrl;

  Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
    required String password2,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'email': email,
          'password': password,
          'password2': password2,
        }),
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 201) {
        return {
          'success': true,
          'token': data['access_token'],
          'user': data['user'],
        };
      }

      return {
        'success': false,
        'message': _parseError(data),
      };
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'username': username, 'password': password}),
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200) {
        return {
          'success': true,
          'token': data['access_token'],
          'user': data['user'],
          'email_verified': data['email_verified'] ?? true,
        };
      }

      return {
        'success': false,
        'message': data['detail'] ?? data['message'] ?? 'Login failed',
      };
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> getProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/profile/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      }
      return {'success': false, 'message': 'Failed to load profile'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> updateProfile(
    String token,
    Map<String, dynamic> data,
    File? image,
  ) async {
    try {
      var request = http.MultipartRequest(
        'PATCH',
        Uri.parse('$baseUrl/profile/'),
      );
      request.headers['Authorization'] = 'Bearer $token';
      
      if (image != null) {
        request.files.add(await http.MultipartFile.fromPath('profile_picture', image.path));
      }
      
      // Add form fields with strict sanitization
      data.forEach((key, value) {
        if (value != null && value.toString().trim().isNotEmpty) {
          String cleanValue = value.toString().trim();
          
          // Remove all potentially dangerous characters
          cleanValue = cleanValue
              .replaceAll(RegExp(r'[\r\n\t]'), '')
              .replaceAll(RegExp(r'[<>"%;()&+=\\|`~!#\$\^\*\[\]{}]'), '')
              .replaceAll(RegExp(r'\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b', caseSensitive: false), '');
          
          // Additional email validation
          if (key == 'email' && cleanValue.isNotEmpty) {
            if (!RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$').hasMatch(cleanValue)) {
              return; // Skip invalid email
            }
          }
          
          if (cleanValue.isNotEmpty) {
            request.fields[key] = cleanValue;
          }
        }
      });
      
      final response = await request.send();
      final responseBody = await response.stream.bytesToString();
      
      if (response.statusCode == 200) {
        return {'success': true};
      }
      
      print('Profile update error (${response.statusCode}): $responseBody');
      return {'success': false, 'message': 'Update failed: ${response.statusCode}'};
    } catch (e) {
      print('Profile update exception: $e');
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> getReviews(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/reviews/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      }
      return {'success': false, 'data': []};
    } catch (e) {
      return {'success': false, 'data': []};
    }
  }

  Future<Map<String, dynamic>> createReview(
    String token,
    int productId,
    int rating,
    String comment,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/reviews/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'product': productId,
          'rating': rating,
          'comment': comment,
        }),
      );

      if (response.statusCode == 201) {
        return {'success': true};
      }
      return {'success': false, 'message': 'Failed to submit review'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  String _parseError(dynamic data) {
    if (data is Map) {
      if (data.containsKey('detail')) return data['detail'];
      if (data.containsKey('message')) return data['message'];
      
      for (var key in ['username', 'email', 'password', 'non_field_errors']) {
        if (data.containsKey(key)) {
          final error = data[key];
          return error is List ? error.first : error.toString();
        }
      }
    }
    return 'Registration failed';
  }
}
