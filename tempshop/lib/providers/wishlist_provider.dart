import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/product.dart';
import '../config/api_config.dart';

class WishlistProvider with ChangeNotifier {
  final List<Product> _items = [];
  String? _token;
  static String get baseUrl => ApiConfig.authBaseUrl;

  void setToken(String? token) {
    _token = token;
    if (token != null) syncWithBackend();
  }

  Future<void> syncWithBackend() async {
    if (_token == null) return;
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/wishlist/'),
        headers: {'Authorization': 'Bearer $_token'},
      );
      if (response.statusCode == 200) {
        final decoded = json.decode(response.body);
        _items.clear();
        if (decoded is List) {
          for (var item in decoded) {
            _items.add(Product.fromJson(item['product']));
          }
        }
        notifyListeners();
      }
    } catch (e) {
      print('Error syncing wishlist: $e');
    }
  }

  List<Product> get items => _items;
  int get count => _items.length;

  bool isInWishlist(int productId) {
    return _items.any((item) => item.id == productId);
  }

  Future<bool> toggle(Product product) async {
    if (_token == null) return false;
    
    if (isInWishlist(product.id)) {
      try {
        final response = await http.delete(
          Uri.parse('$baseUrl/wishlist/product/${product.id}/'),
          headers: {'Authorization': 'Bearer $_token'},
        );
        if (response.statusCode == 204 || response.statusCode == 200) {
          _items.removeWhere((item) => item.id == product.id);
          notifyListeners();
          return true;
        }
      } catch (e) {
        print('Error removing from wishlist: $e');
      }
    } else {
      try {
        final response = await http.post(
          Uri.parse('$baseUrl/wishlist/'),
          headers: {
            'Authorization': 'Bearer $_token',
            'Content-Type': 'application/json',
          },
          body: json.encode({'product_id': product.id}),
        );
        if (response.statusCode == 201 || response.statusCode == 200) {
          _items.add(product);
          notifyListeners();
          return true;
        }
      } catch (e) {
        print('Error adding to wishlist: $e');
      }
    }
    return false;
  }
}
