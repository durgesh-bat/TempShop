import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';
import 'package:open_file/open_file.dart';
import '../config/api_config.dart';
import '../models/shopkeeper_models.dart';

class ApiService {
  static String? _accessToken;
  
  static Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _accessToken = prefs.getString('access_token');
  }
  
  static Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', token);
    _accessToken = token;
  }
  
  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    _accessToken = null;
  }
  
  static Map<String, String> _getHeaders({bool includeAuth = true}) {
    final headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && _accessToken != null) {
      headers['Authorization'] = 'Bearer $_accessToken';
    }
    
    return headers;
  }

  // Authentication
  static Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
    required String password2,
    String? phoneNumber,
    String? address,
    String? businessName,
    String? businessType,
  }) async {
    final response = await http.post(
      Uri.parse(ApiConfig.shopkeeperRegister),
      headers: _getHeaders(includeAuth: false),
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'password2': password2,
        'phone_number': phoneNumber,
        'address': address,
        'business_name': businessName,
        'business_type': businessType,
      }),
    );
    
    final data = jsonDecode(response.body);
    
    if (response.statusCode == 201) {
      await _saveToken(data['tokens']['access']);
      return {'success': true, 'data': data};
    }
    
    return {'success': false, 'error': data};
  }
  
  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse(ApiConfig.shopkeeperLogin),
      headers: _getHeaders(includeAuth: false),
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );
    
    final data = jsonDecode(response.body);
    
    if (response.statusCode == 200) {
      await _saveToken(data['tokens']['access']);
      return {'success': true, 'data': data};
    }
    
    return {'success': false, 'error': data};
  }

  // Profile
  static Future<Shopkeeper?> getProfile() async {
    await _loadToken();
    
    final response = await http.get(
      Uri.parse(ApiConfig.shopkeeperProfile),
      headers: _getHeaders(),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Shopkeeper.fromJson(data);
    }
    
    return null;
  }
  
  static Future<bool> updateProfile(Map<String, dynamic> profileData, {File? image}) async {
    await _loadToken();
    
    try {
      var request = http.MultipartRequest(
        'PUT',
        Uri.parse(ApiConfig.shopkeeperProfile),
      );
      
      request.headers.addAll({
        'Authorization': 'Bearer $_accessToken',
      });
      
      // Add form fields
      profileData.forEach((key, value) {
        if (value != null) {
          request.fields[key] = value.toString();
        }
      });
      
      // Add image if provided
      if (image != null) {
        request.files.add(await http.MultipartFile.fromPath('profile_picture', image.path));
      }
      
      final response = await request.send();
      return response.statusCode == 200;
    } catch (e) {
      print('Error updating profile: $e');
      return false;
    }
  }

  // Dashboard
  static Future<Map<String, dynamic>?> getDashboardData() async {
    await _loadToken();
    
    final response = await http.get(
      Uri.parse(ApiConfig.shopkeeperDashboard),
      headers: _getHeaders(),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    
    return null;
  }

  // Products
  static Future<List<ShopkeeperProduct>> getProducts() async {
    await _loadToken();
    
    final response = await http.get(
      Uri.parse(ApiConfig.shopkeeperProducts),
      headers: _getHeaders(),
    );
    
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => ShopkeeperProduct.fromJson(json)).toList();
    }
    
    return [];
  }
  
  static Future<bool> addProduct({
    required String name,
    required double price,
    String? description,
    String? category,
    int stockQuantity = 0,
    File? image,
  }) async {
    await _loadToken();
    
    var request = http.MultipartRequest(
      'POST',
      Uri.parse(ApiConfig.shopkeeperProducts),
    );
    
    request.headers.addAll({
      'Authorization': 'Bearer $_accessToken',
    });
    
    request.fields['name'] = name;
    request.fields['price'] = price.toString();
    request.fields['description'] = description ?? '';
    request.fields['category'] = category ?? 'other';
    request.fields['stock_quantity'] = stockQuantity.toString();
    
    if (image != null) {
      request.files.add(await http.MultipartFile.fromPath('image', image.path));
    }
    
    final response = await request.send();
    return response.statusCode == 201;
  }

  // Orders
  static Future<List<CustomerOrder>> getCustomerOrders() async {
    await _loadToken();
    
    final response = await http.get(
      Uri.parse(ApiConfig.shopkeeperOrders),
      headers: _getHeaders(),
    );
    
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => CustomerOrder.fromJson(json)).toList();
    }
    
    return [];
  }

  // Inventory
  static Future<List<InventoryItem>> getInventory() async {
    await _loadToken();
    
    final response = await http.get(
      Uri.parse(ApiConfig.shopkeeperInventory),
      headers: _getHeaders(),
    );
    
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => InventoryItem.fromJson(json)).toList();
    }
    
    return [];
  }
  
  static Future<bool> updateStock(String shopkeeperProductId, int stockQuantity) async {
    await _loadToken();
    
    final response = await http.patch(
      Uri.parse(ApiConfig.updateProductStock(shopkeeperProductId)),
      headers: _getHeaders(),
      body: jsonEncode({'stock_quantity': stockQuantity}),
    );
    
    return response.statusCode == 200;
  }
  
  static Future<bool> toggleAvailability(String shopkeeperProductId) async {
    await _loadToken();
    
    final response = await http.patch(
      Uri.parse(ApiConfig.toggleProductAvailability(shopkeeperProductId)),
      headers: _getHeaders(),
    );
    
    return response.statusCode == 200;
  }

  // Analytics & Payments
  static Future<Map<String, dynamic>?> getPaymentHistory() async {
    await _loadToken();
    
    final response = await http.get(
      Uri.parse(ApiConfig.shopkeeperPayments),
      headers: _getHeaders(),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    
    return null;
  }
  
  static Future<List<Map<String, dynamic>>> getAnalytics() async {
    await _loadToken();
    
    final response = await http.get(
      Uri.parse(ApiConfig.shopkeeperAnalytics),
      headers: _getHeaders(),
    );
    
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.cast<Map<String, dynamic>>();
    }
    
    return [];
  }

  // Cancel Order
  static Future<bool> cancelOrder(String orderItemId) async {
    await _loadToken();
    
    try {
      final response = await http.patch(
        Uri.parse('${ApiConfig.baseUrl}/shopkeeper/order-items/$orderItemId/cancel/'),
        headers: _getHeaders(),
        body: jsonEncode({'status': 'cancelled'}),
      );
      
      return response.statusCode == 200;
    } catch (e) {
      print('Error cancelling order: $e');
      return false;
    }
  }

  // View Receipt - Download and open
  static Future<String?> viewReceipt(String orderItemId) async {
    await _loadToken();
    
    try {
      final response = await http.get(
        Uri.parse(ApiConfig.orderReceipt(orderItemId)),
        headers: _getHeaders(),
      );
      
      if (response.statusCode == 200) {
        final bytes = response.bodyBytes;
        final fileName = 'TempShop_Receipt_${orderItemId}_view.pdf';
        
        // Save to temp directory for viewing
        final directory = await getTemporaryDirectory();
        final file = File('${directory.path}/$fileName');
        await file.writeAsBytes(bytes);
        
        // Open the PDF file
        final result = await OpenFile.open(file.path);
        print('Open file result: ${result.message}');
        
        return file.path;
      }
      
      return null;
    } catch (e) {
      print('Error viewing receipt: $e');
      return null;
    }
  }

  // Download Receipt
  static Future<bool> downloadReceipt(String orderItemId) async {
    await _loadToken();
    
    try {
      final response = await http.get(
        Uri.parse(ApiConfig.orderReceipt(orderItemId)),
        headers: _getHeaders(),
      );
      
      if (response.statusCode == 200) {
        final bytes = response.bodyBytes;
        final fileName = 'TempShop_Receipt_${orderItemId}_${DateTime.now().millisecondsSinceEpoch}.pdf';
        
        // Save to Documents/TempShop_Receipts folder
        final success = await _saveReceiptToFile(bytes, fileName);
        return success;
      }
      
      return false;
    } catch (e) {
      print('Error downloading receipt: $e');
      return false;
    }
  }
  
  static Future<bool> _saveReceiptToFile(List<int> bytes, String fileName) async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final receiptsDir = Directory('${directory.path}/TempShop_Receipts');
      
      if (!await receiptsDir.exists()) {
        await receiptsDir.create(recursive: true);
      }
      
      final file = File('${receiptsDir.path}/$fileName');
      await file.writeAsBytes(bytes);
      
      print('Receipt saved to: ${file.path}');
      return true;
    } catch (e) {
      print('Error saving receipt: $e');
      return false;
    }
  }

  // Update Product
  static Future<bool> updateProduct({
    required String productId,
    required String name,
    required double price,
    String? description,
    String? category,
    File? image,
  }) async {
    await _loadToken();
    
    try {
      var request = http.MultipartRequest(
        'PUT',
        Uri.parse(ApiConfig.productDetail(productId)),
      );
      
      request.headers.addAll({
        'Authorization': 'Bearer $_accessToken',
      });
      
      // Clean HTML entities from all fields
      String cleanName = name
          .replaceAll('&#39;', "'")
          .replaceAll('&quot;', '"')
          .replaceAll('&amp;', '&')
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>');
      
      String cleanDescription = description != null ? description
          .replaceAll('&#39;', "'")
          .replaceAll('&quot;', '"')
          .replaceAll('&amp;', '&')
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>') : '';
      
      String cleanCategory = category != null ? category
          .replaceAll('&#39;', "'")
          .replaceAll('&quot;', '"')
          .replaceAll('&amp;', '&')
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>') : '';
      
      request.fields['name'] = cleanName;
      request.fields['price'] = price.toString();
      if (description != null) request.fields['description'] = cleanDescription;
      if (category != null) request.fields['category'] = cleanCategory;
      
      if (image != null) {
        request.files.add(await http.MultipartFile.fromPath('image', image.path));
      }
      
      print('Sending request to: ${request.url}');
      print('Request fields: ${request.fields}');
      
      final response = await request.send();
      final responseBody = await response.stream.bytesToString();
      
      print('Response status: ${response.statusCode}');
      print('Response body: $responseBody');
      
      return response.statusCode == 200;
    } catch (e) {
      print('Error updating product: $e');
      return false;
    }
  }
}