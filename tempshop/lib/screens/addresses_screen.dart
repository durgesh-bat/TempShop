import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/order.dart';
import '../services/order_service.dart';
import '../providers/auth_provider.dart';

class AddressesScreen extends StatefulWidget {
  const AddressesScreen({super.key});

  @override
  State<AddressesScreen> createState() => _AddressesScreenState();
}

class _AddressesScreenState extends State<AddressesScreen> {
  List<Address> _addresses = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadAddresses();
  }

  Future<void> _loadAddresses() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.token == null) return;

    if (!mounted) return;
    setState(() => _loading = true);
    final addresses = await OrderService().getAddresses(auth.token!);
    if (!mounted) return;
    setState(() {
      _addresses = addresses;
      _loading = false;
    });
  }

  void _showAddressDialog({Address? address}) {
    final labelController = TextEditingController(text: address?.label ?? '');
    final streetController = TextEditingController(text: address?.street ?? '');
    final cityController = TextEditingController(text: address?.city ?? '');
    final stateController = TextEditingController(text: address?.state ?? '');
    final postalController = TextEditingController(text: address?.postalCode ?? '');

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(address == null ? 'Add Address' : 'Edit Address'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: labelController, decoration: const InputDecoration(labelText: 'Label (Home/Work)')),
              const SizedBox(height: 12),
              TextField(controller: streetController, decoration: const InputDecoration(labelText: 'Street Address')),
              const SizedBox(height: 12),
              TextField(controller: cityController, decoration: const InputDecoration(labelText: 'City')),
              const SizedBox(height: 12),
              TextField(controller: stateController, decoration: const InputDecoration(labelText: 'State')),
              const SizedBox(height: 12),
              TextField(controller: postalController, decoration: const InputDecoration(labelText: 'Postal Code')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              final auth = Provider.of<AuthProvider>(context, listen: false);
              if (auth.token == null) return;
              
              final result = address == null
                  ? await OrderService().createAddress(
                      token: auth.token!,
                      label: labelController.text,
                      street: streetController.text,
                      city: cityController.text,
                      state: stateController.text,
                      postalCode: postalController.text,
                    )
                  : await OrderService().updateAddress(
                      token: auth.token!,
                      id: address.id,
                      label: labelController.text,
                      street: streetController.text,
                      city: cityController.text,
                      state: stateController.text,
                      postalCode: postalController.text,
                    );
              
              Navigator.pop(context);
              if (result['success']) {
                _loadAddresses();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Row(
                      children: [
                        const Icon(Icons.check_circle, color: Colors.white),
                        const SizedBox(width: 12),
                        Text('Address ${address == null ? "added" : "updated"} successfully!'),
                      ],
                    ),
                    backgroundColor: Colors.green,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    duration: const Duration(seconds: 2),
                  ),
                );
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
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFF9FAFB), Color(0xFFF3F4F6)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const Text('My Addresses', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              Expanded(
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : _addresses.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.location_off, size: 80, color: Colors.grey),
                                const SizedBox(height: 16),
                                const Text('No addresses yet', style: TextStyle(fontSize: 18, color: Colors.grey)),
                                const SizedBox(height: 24),
                                ElevatedButton.icon(
                                  onPressed: () => _showAddressDialog(),
                                  icon: const Icon(Icons.add),
                                  label: const Text('Add Address'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF2563EB),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _addresses.length,
                            itemBuilder: (_, i) {
                              final addr = _addresses[i];
                              return Container(
                                margin: const EdgeInsets.only(bottom: 16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.05),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: ListTile(
                                  contentPadding: const EdgeInsets.all(16),
                                  leading: CircleAvatar(
                                    backgroundColor: const Color(0xFF2563EB).withOpacity(0.1),
                                    child: const Icon(Icons.location_on, color: Color(0xFF2563EB)),
                                  ),
                                  title: Row(
                                    children: [
                                      Text(addr.label, style: const TextStyle(fontWeight: FontWeight.bold)),
                                      if (addr.isDefault) ...[
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: Colors.green.withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: const Text('Default', style: TextStyle(fontSize: 10, color: Colors.green, fontWeight: FontWeight.bold)),
                                        ),
                                      ],
                                    ],
                                  ),
                                  subtitle: Padding(
                                    padding: const EdgeInsets.only(top: 8),
                                    child: Text('${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}', style: const TextStyle(color: Color(0xFF6B7280))),
                                  ),
                                  trailing: IconButton(
                                    icon: const Icon(Icons.edit, color: Color(0xFF2563EB)),
                                    onPressed: () => _showAddressDialog(address: addr),
                                  ),
                                ),
                              );
                            },
                          ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: _addresses.isNotEmpty
          ? FloatingActionButton(
              onPressed: () => _showAddressDialog(),
              backgroundColor: const Color(0xFF2563EB),
              child: const Icon(Icons.add, color: Colors.white),
            )
          : null,
    );
  }
}
