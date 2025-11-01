import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/cart_item.dart';
import '../models/product.dart';
import '../config/api_config.dart';

class CartProvider with ChangeNotifier {
  final List<CartItem> _items = [];
  String? _token;
  static String get baseUrl => ApiConfig.cartBaseUrl;

  void setToken(String? token) {
    _token = token;
    if (token != null) syncWithBackend();
  }

  Future<void> syncWithBackend() async {
    if (_token == null) return;
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/cart/'),
        headers: {'Authorization': 'Bearer $_token'},
      );
      if (response.statusCode == 200) {
        final decoded = json.decode(response.body);
        _items.clear();
        if (decoded is Map && decoded.containsKey('items')) {
          final items = decoded['items'] as List;
          for (var item in items) {
            _items.add(CartItem(
              product: Product.fromJson(item['product']),
              quantity: item['quantity'],
            ));
          }
        }
        notifyListeners();
      }
    } catch (e) {
      print('Error syncing cart: $e');
    }
  }

  List<CartItem> get items => _items;
  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);
  double get total => _items.fold(0, (sum, item) => sum + item.total);

  Future<bool> addItem(Product product) async {
    if (_token == null) return false;
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/cart/${product.id}/'),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
        body: json.encode({'quantity': 1}),
      );
      if (response.statusCode == 200) {
        await syncWithBackend();
        return true;
      }
    } catch (e) {
      print('Error adding to cart: $e');
    }
    return false;
  }

  Future<void> removeItem(int productId) async {
    if (_token == null) return;
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/cart/$productId/'),
        headers: {'Authorization': 'Bearer $_token'},
      );
      if (response.statusCode == 200) {
        await syncWithBackend();
      }
    } catch (e) {
      print('Error removing from cart: $e');
    }
  }

  Future<void> updateQuantity(int productId, int quantity) async {
    if (_token == null) return;
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/cart/$productId/'),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
        body: json.encode({'quantity': quantity}),
      );
      if (response.statusCode == 200) {
        await syncWithBackend();
      }
    } catch (e) {
      print('Error updating cart quantity: $e');
    }
  }

  void clear() {
    if (_token == null) return;
    _items.clear();
    notifyListeners();
  }
}
