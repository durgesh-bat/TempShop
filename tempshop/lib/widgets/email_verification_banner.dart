import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import '../providers/auth_provider.dart';
import '../config/api_config.dart';

class EmailVerificationBanner extends StatelessWidget {
  const EmailVerificationBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (!auth.isAuthenticated || auth.isEmailVerified) {
          return const SizedBox.shrink();
        }
        
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          margin: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.orange[50],
            border: Border.all(color: Colors.orange[300]!),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Icon(Icons.warning_amber, color: Colors.orange[700], size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Please verify your email to access all features',
                  style: TextStyle(color: Colors.orange[800], fontSize: 14),
                ),
              ),
              TextButton(
                onPressed: () => _showVerificationDialog(context),
                child: const Text('Verify', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showVerificationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Email Verification'),
        content: const Text('We will send a 6-digit OTP to your email for verification.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _sendOTP(context);
            },
            child: const Text('Send OTP'),
          ),
        ],
      ),
    );
  }

  void _sendOTP(BuildContext context) async {
    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final response = await http.post(
        Uri.parse('${ApiConfig.authBaseUrl}/send-otp/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${auth.token}',
          'ngrok-skip-browser-warning': 'true',
        },
      );
      
      if (response.statusCode == 200) {
        Navigator.pushNamed(context, '/otp-verification');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to send OTP'), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network error'), backgroundColor: Colors.red),
      );
    }
  }
}