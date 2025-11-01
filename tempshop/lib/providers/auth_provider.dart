import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  String? _token;
  String? _username;
  String? _email;

  AuthProvider() {
    _initAuth();
  }

  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;
  String? get username => _username;
  String? get email => _email;

  Future<void> _initAuth() async {
    try {
      await checkAuthStatus();
      print('Auth initialized: $_isAuthenticated, username: $_username, email: $_email');
    } catch (e) {
      print('Auth init error: $e');
    }
  }

  Future<void> checkAuthStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('auth_token');
      _username = prefs.getString('username');
      _email = prefs.getString('email');
      _isAuthenticated = _token != null;
      notifyListeners();
    } catch (e) {
      _isAuthenticated = false;
      _token = null;
      _username = null;
      _email = null;
    }
  }

  Future<void> login(String token, {String? username, String? email}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    if (username != null) await prefs.setString('username', username);
    if (email != null) await prefs.setString('email', email);
    _token = token;
    _username = username;
    _email = email;
    _isAuthenticated = true;
    print('Login: stored token length=${token.length}, username=$username, email=$email');
    print('Token stored: ${_token != null}');
    notifyListeners();
  }

  String? getToken() {
    if (_token != null && _token!.length > 20) {
      print('Getting token: ${_token!.substring(0, 20)}...');
    } else {
      print('Getting token: $_token');
    }
    return _token;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('username');
    await prefs.remove('email');
    _token = null;
    _username = null;
    _email = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}