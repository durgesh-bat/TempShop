import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import '../models/order.dart';
import '../config/api_config.dart';
import 'http_interceptor.dart';

class OrderService {
  static String get baseUrl => ApiConfig.authBaseUrl;
  final BuildContext? context;
  
  OrderService({this.context});
  
  Future<void> _checkResponse(http.Response response) async {
    if (context != null) {
      await HttpInterceptor.checkResponse(response, context!);
    }
  }

  Future<List<Order>> getOrders(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/orders/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      await _checkResponse(response);

      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        return data.map((json) => Order.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching orders: $e');
    }
    return [];
  }

  Future<List<Address>> getAddresses(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/addresses/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        return data.map((json) => Address.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching addresses: $e');
    }
    return [];
  }

  Future<Map<String, dynamic>> createAddress({
    required String token,
    required String label,
    required String street,
    required String city,
    required String state,
    required String postalCode,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/addresses/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'label': label,
          'street': street,
          'city': city,
          'state': state,
          'postal_code': postalCode,
          'country': 'India',
        }),
      );

      if (response.statusCode == 201) {
        return {'success': true};
      }
      return {
        'success': false,
        'message': json.decode(response.body)['detail'] ?? 'Failed to create address',
      };
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> updateAddress({
    required String token,
    required int id,
    required String label,
    required String street,
    required String city,
    required String state,
    required String postalCode,
  }) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/addresses/$id/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'label': label,
          'street': street,
          'city': city,
          'state': state,
          'postal_code': postalCode,
        }),
      );

      if (response.statusCode == 200) {
        return {'success': true};
      }
      return {'success': false, 'message': 'Failed to update address'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> createOrder({
    required String token,
    required int addressId,
    required String paymentMethod,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'address_id': addressId,
          'payment_method': paymentMethod,
        }),
      );

      if (response.statusCode == 201) {
        return {'success': true};
      }
      return {
        'success': false,
        'message': json.decode(response.body)['detail'] ?? 'Failed to create order',
      };
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
}
