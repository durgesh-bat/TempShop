import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';

class AuthWrapper extends StatelessWidget {
  final Widget child;
  
  const AuthWrapper({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Set context for providers that need to handle 401 responses
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CartProvider>(context, listen: false).setContext(context);
    });
    
    return child;
  }
}