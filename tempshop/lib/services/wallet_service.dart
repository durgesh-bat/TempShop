import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class WalletService {
  static String get baseUrl => ApiConfig.authBaseUrl;

  Future<Map<String, dynamic>> getWallet(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/wallet/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      }
      return {'success': false, 'message': 'Failed to load wallet'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> getTransactions(String token) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/wallet/transactions/'),
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

  Future<Map<String, dynamic>> addMoney(String token, double amount) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/wallet/add/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({'amount': amount}),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      }
      return {'success': false, 'message': 'Failed to add money'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
}
