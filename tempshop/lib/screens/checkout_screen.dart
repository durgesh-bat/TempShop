import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/order.dart';
import '../services/order_service.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  List<Address> _addresses = [];
  int? _selectedAddress;
  String? _paymentMethod;
  bool _loading = false;
  bool _addressLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAddresses();
  }

  Future<void> _loadAddresses() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.token == null) return;

    final addresses = await OrderService().getAddresses(auth.token!);
    if (!mounted) return;
    setState(() {
      _addresses = addresses;
      _selectedAddress = addresses.isNotEmpty ? addresses.firstWhere((a) => a.isDefault, orElse: () => addresses.first).id : null;
      _addressLoading = false;
    });
  }

  Future<void> _placeOrder() async {
    if (_selectedAddress == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a delivery address')),
      );
      return;
    }
    if (_paymentMethod == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a payment method')),
      );
      return;
    }

    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.token == null) return;

    if (!mounted) return;
    setState(() => _loading = true);
    final result = await OrderService().createOrder(
      token: auth.token!,
      addressId: _selectedAddress!,
      paymentMethod: _paymentMethod!,
    );
    if (!mounted) return;
    setState(() => _loading = false);

    if (result['success']) {
      Provider.of<CartProvider>(context, listen: false).clear();
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 12),
                const Text('Order placed successfully! 🎉'),
              ],
            ),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.error, color: Colors.white),
              const SizedBox(width: 12),
              Expanded(child: Text(result['message'])),
            ],
          ),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: cart.items.isEmpty
          ? const Center(child: Text('Your cart is empty'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('📍 Delivery Address', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  _addressLoading
                      ? const Center(child: CircularProgressIndicator())
                      : _addresses.isEmpty
                          ? const Text('No addresses found')
                          : Column(
                              children: _addresses.map((addr) => RadioListTile<int>(
                                    value: addr.id,
                                    groupValue: _selectedAddress,
                                    onChanged: (val) => setState(() => _selectedAddress = val),
                                    title: Text(addr.label, style: const TextStyle(fontWeight: FontWeight.bold)),
                                    subtitle: Text('${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}'),
                                  )).toList(),
                            ),
                  const SizedBox(height: 24),
                  const Text('💳 Payment Method', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  ...['cod', 'card', 'upi', 'wallet'].map((method) => RadioListTile<String>(
                        value: method,
                        groupValue: _paymentMethod,
                        onChanged: (val) => setState(() => _paymentMethod = val),
                        title: Text(_getPaymentLabel(method)),
                        subtitle: Text(_getPaymentSubtitle(method)),
                      )),
                  const SizedBox(height: 24),
                  const Text('📦 Order Summary', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  ...cart.items.map((item) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('${item.product.title} × ${item.quantity}'),
                            Text('₹${item.total.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                      )),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      Text('₹${cart.total.toStringAsFixed(0)}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue)),
                    ],
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _loading || _selectedAddress == null || _paymentMethod == null ? null : _placeOrder,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: Colors.black,
                      ),
                      child: _loading
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Text('Place Order', style: TextStyle(fontSize: 16, color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  String _getPaymentLabel(String method) {
    switch (method) {
      case 'cod': return 'Cash on Delivery';
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI';
      case 'wallet': return 'Wallet';
      default: return method;
    }
  }

  String _getPaymentSubtitle(String method) {
    switch (method) {
      case 'cod': return 'Pay when you receive';
      case 'card': return 'Visa, Mastercard, Amex';
      case 'upi': return 'Google Pay, PhonePe, Paytm';
      case 'wallet': return 'Use wallet balance';
      default: return '';
    }
  }
}
