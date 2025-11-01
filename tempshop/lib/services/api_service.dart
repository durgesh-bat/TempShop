import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';
import '../config/api_config.dart';

class ApiService {
  static String get baseUrl => ApiConfig.baseUrl;

  Future<List<Product>> getProducts() async {
    try {
      print('Fetching products from: $baseUrl/products/');
      final response = await http.get(
        Uri.parse('$baseUrl/products/'),
        headers: {'Content-Type': 'application/json'},
      );
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      
      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        print('Products count: ${data.length}');
        return data.map((json) => Product.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching products: $e');
    }
    return [];
  }

  Future<List<String>> getCategories() async {
    try {
      print('Fetching categories from: $baseUrl/categories/');
      final response = await http.get(
        Uri.parse('$baseUrl/categories/'),
        headers: {'Content-Type': 'application/json'},
      );
      print('Categories response status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        print('Categories count: ${data.length}');
        return data.map((c) => c['name'].toString()).toList();
      }
    } catch (e) {
      print('Error fetching categories: $e');
    }
    return [];
  }

  Future<List<Map<String, dynamic>>> getCategoriesWithImages() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/categories/'),
        headers: {'Content-Type': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        return data.map((c) => {
          'name': c['name'].toString(),
          'image': c['image']?.toString() ?? '',
        }).toList();
      }
    } catch (e) {
      print('Error fetching categories: $e');
    }
    return [];
  }

  Future<List<Product>> searchProducts(String query) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/search/?q=$query'),
        headers: {'Content-Type': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        return data.map((json) => Product.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error searching products: $e');
    }
    return [];
  }

  Future<List<Product>> getRecentlyViewed([String? token]) async {
    try {
      final headers = {'Content-Type': 'application/json'};
      if (token != null) headers['Authorization'] = 'Bearer $token';
      
      final response = await http.get(
        Uri.parse('$baseUrl/recently-viewed/'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        return data.map((json) => Product.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching recently viewed: $e');
    }
    return [];
  }

  Future<List<Product>> getSimilarProducts(int productId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/similar-products/$productId/'),
        headers: {'Content-Type': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        List data = json.decode(response.body);
        return data.map((json) => Product.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching similar products: $e');
    }
    return [];
  }
}
