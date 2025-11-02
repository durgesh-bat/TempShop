import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';
import '../services/token_service.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  String? _token;
  String? _username;
  String? _email;
  String? _profilePicture;
  bool _isEmailVerified = false;

  AuthProvider() {
    _initAuth();
  }

  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;
  String? get username => _username;
  String? get email => _email;
  String? get profilePicture => _profilePicture;
  bool get isEmailVerified => _isEmailVerified;

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
      _profilePicture = prefs.getString('profile_picture');
      _isEmailVerified = prefs.getBool('email_verified') ?? false;
      
      if (_token != null) {
        // Validate token with server
        final isValid = await TokenService.validateToken(_token!);
        if (isValid) {
          _isAuthenticated = true;
          await _loadProfileData();
        } else {
          // Try to refresh token
          final newToken = await TokenService.refreshToken(_token!);
          if (newToken != null) {
            await prefs.setString('auth_token', newToken);
            _token = newToken;
            _isAuthenticated = true;
            await _loadProfileData();
          } else {
            // Token invalid and can't refresh - logout
            await logout();
          }
        }
      } else {
        _isAuthenticated = false;
      }
      
      notifyListeners();
    } catch (e) {
      _isAuthenticated = false;
      _token = null;
      _username = null;
      _email = null;
      _profilePicture = null;
      notifyListeners();
    }
  }
  
  Future<void> _loadProfileData() async {
    try {
      final result = await AuthService().getProfile(_token!);
      if (result['success']) {
        final data = result['data'];
        final prefs = await SharedPreferences.getInstance();
        
        if (data['username'] != null) {
          _username = data['username'];
          await prefs.setString('username', _username!);
        }
        if (data['email'] != null) {
          _email = data['email'];
          await prefs.setString('email', _email!);
        }
        if (data['profile_picture'] != null) {
          _profilePicture = data['profile_picture'];
          await prefs.setString('profile_picture', _profilePicture!);
        }
        if (data.containsKey('is_email_verified')) {
          _isEmailVerified = data['is_email_verified'] ?? false;
          await prefs.setBool('email_verified', _isEmailVerified);
        } else if (data.containsKey('email_verified')) {
          _isEmailVerified = data['email_verified'] ?? false;
          await prefs.setBool('email_verified', _isEmailVerified);
        }
      } else {
        // Profile fetch failed - token might be invalid
        await logout();
      }
    } catch (e) {
      print('Error loading profile data: $e');
      // On error, logout to be safe
      await logout();
    }
  }

  Future<void> login(String token, {String? username, String? email, String? profilePicture, bool? emailVerified}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    if (username != null) await prefs.setString('username', username);
    if (email != null) await prefs.setString('email', email);
    if (profilePicture != null) await prefs.setString('profile_picture', profilePicture);
    if (emailVerified != null) await prefs.setBool('email_verified', emailVerified);
    _token = token;
    _username = username;
    _email = email;
    _profilePicture = profilePicture;
    _isEmailVerified = emailVerified ?? false;
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
    await prefs.remove('profile_picture');
    await prefs.remove('email_verified');
    _token = null;
    _username = null;
    _email = null;
    _profilePicture = null;
    _isEmailVerified = false;
    _isAuthenticated = false;
    notifyListeners();
  }
}