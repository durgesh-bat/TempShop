import 'package:flutter/material.dart';
import 'dart:io';
import '../models/shopkeeper_models.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  Shopkeeper? _shopkeeper;
  bool _isLoading = false;
  String? _error;

  Shopkeeper? get shopkeeper => _shopkeeper;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _shopkeeper != null;

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  Future<bool> register({
    required String username,
    required String email,
    required String password,
    required String confirmPassword,
    String? phoneNumber,
    String? address,
    String? businessName,
    String? businessType,
  }) async {
    _setLoading(true);
    _setError(null);

    try {
      final result = await ApiService.register(
        username: username,
        email: email,
        password: password,
        password2: confirmPassword,
        phoneNumber: phoneNumber,
        address: address,
        businessName: businessName,
        businessType: businessType,
      );

      if (result['success']) {
        _shopkeeper = Shopkeeper.fromJson(result['data']['shopkeeper']);
        _setLoading(false);
        return true;
      } else {
        _setError(result['error']['detail'] ?? 'Registration failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Network error: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  Future<bool> login({
    required String username,
    required String password,
  }) async {
    _setLoading(true);
    _setError(null);

    try {
      final result = await ApiService.login(
        username: username,
        password: password,
      );

      if (result['success']) {
        _shopkeeper = Shopkeeper.fromJson(result['data']['shopkeeper']);
        _setLoading(false);
        return true;
      } else {
        _setError(result['error']['detail'] ?? 'Login failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Network error: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  Future<void> loadProfile() async {
    try {
      final profile = await ApiService.getProfile();
      if (profile != null) {
        _shopkeeper = profile;
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to load profile');
    }
  }

  Future<bool> updateProfile(Map<String, dynamic> profileData, {File? image}) async {
    _setLoading(true);
    _setError(null);

    try {
      final success = await ApiService.updateProfile(profileData, image: image);
      if (success) {
        await loadProfile();
      }
      _setLoading(false);
      return success;
    } catch (e) {
      _setError('Failed to update profile');
      _setLoading(false);
      return false;
    }
  }

  Future<void> logout() async {
    await ApiService.clearToken();
    _shopkeeper = null;
    _error = null;
    notifyListeners();
  }
}