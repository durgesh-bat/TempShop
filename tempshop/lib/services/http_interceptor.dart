import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import '../providers/auth_provider.dart';
import '../screens/login_screen.dart';
import 'token_service.dart';

class HttpInterceptor {
  static Future<void> handleUnauthorized(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final currentToken = authProvider.token;
    
    if (currentToken != null) {
      // Try to refresh token first
      final newToken = await TokenService.refreshToken(currentToken);
      if (newToken != null) {
        // Token refreshed successfully, update auth provider
        await authProvider.login(newToken, 
          username: authProvider.username,
          email: authProvider.email,
          profilePicture: authProvider.profilePicture,
          emailVerified: authProvider.isEmailVerified
        );
        return; // Don't logout, token was refreshed
      }
    }
    
    // Token refresh failed or no token - logout user
    await authProvider.logout();
    
    // Show message and navigate to login
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Session expired. Please login again.'),
          backgroundColor: Colors.orange,
          duration: Duration(seconds: 3),
        ),
      );
      
      // Navigate to login screen
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }
  
  static Future<void> checkResponse(http.Response response, BuildContext context) async {
    if (response.statusCode == 401) {
      await handleUnauthorized(context);
    }
  }
}