import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/api_config.dart';

class TokenService {
  static Future<bool> validateToken(String token) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.authBaseUrl}/profile/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
  
  static Future<String?> refreshToken(String token) async {
    // Token refresh not supported by server
    return null;
  }
}