import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/order.dart';
import '../services/order_service.dart';
import '../providers/auth_provider.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> with AutomaticKeepAliveClientMixin {
  List<Order> _orders = [];
  bool _loading = true;
  String _filter = 'all';

  @override
  bool get wantKeepAlive => false;

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.isAuthenticated && _orders.isEmpty && !_loading) {
      _loadOrders();
    }
  }

  Future<void> _loadOrders() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    
    if (!auth.isAuthenticated || auth.token == null) {
      if (!mounted) return;
      setState(() => _loading = false);
      return;
    }

    if (!mounted) return;
    setState(() => _loading = true);
    
    try {
      print('Loading orders with token: ${auth.token!.substring(0, 20)}...');
      final orders = await OrderService().getOrders(auth.token!);
      print('Orders loaded: ${orders.length}');
      if (!mounted) return;
      setState(() {
        _orders = orders;
        _loading = false;
      });
    } catch (e) {
      print('Error loading orders: $e');
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  List<Order> get _filteredOrders {
    if (_filter == 'all') return _orders;
    return _orders.where((o) => o.status == _filter).toList();
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending': return Colors.yellow.shade700;
      case 'processing': return Colors.blue.shade700;
      case 'shipped': return Colors.purple.shade700;
      case 'delivered': return Colors.green.shade700;
      case 'cancelled': return Colors.red.shade700;
      default: return Colors.grey;
    }
  }

  String _getStatusIcon(String status) {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '📦';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final auth = Provider.of<AuthProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Orders'),
      ),
      body: !auth.isAuthenticated
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.login, size: 80, color: Colors.grey),
                  const SizedBox(height: 16),
                  const Text('Please login to view orders', style: TextStyle(fontSize: 18, color: Colors.grey)),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/login'),
                    child: const Text('Login'),
                  ),
                ],
              ),
            )
          : _loading
              ? const Center(child: CircularProgressIndicator())
              : Column(
              children: [
                SizedBox(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                    children: ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']
                        .map((status) => Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: FilterChip(
                                label: Text(status == 'all' ? 'All' : status[0].toUpperCase() + status.substring(1)),
                                selected: _filter == status,
                                onSelected: (_) => setState(() => _filter = status),
                              ),
                            ))
                        .toList(),
                  ),
                ),
                Expanded(
                  child: _filteredOrders.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('📦', style: TextStyle(fontSize: 60)),
                              const SizedBox(height: 16),
                              Text(
                                _filter == 'all' ? 'No orders yet' : 'No $_filter orders',
                                style: const TextStyle(fontSize: 18, color: Colors.grey),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(8),
                          itemCount: _filteredOrders.length,
                          itemBuilder: (_, i) {
                            final order = _filteredOrders[i];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text('Order #${order.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                            const SizedBox(height: 4),
                                            Text(order.createdAt, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                                          ],
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                          decoration: BoxDecoration(
                                            color: _getStatusColor(order.status).withOpacity(0.2),
                                            borderRadius: BorderRadius.circular(20),
                                          ),
                                          child: Text(
                                            '${_getStatusIcon(order.status)} ${order.status[0].toUpperCase()}${order.status.substring(1)}',
                                            style: TextStyle(color: _getStatusColor(order.status), fontWeight: FontWeight.bold, fontSize: 12),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const Divider(height: 24),
                                    ...order.items.map((item) => Padding(
                                          padding: const EdgeInsets.only(bottom: 8),
                                          child: Row(
                                            children: [
                                              ClipRRect(
                                                borderRadius: BorderRadius.circular(8),
                                                child: Image.network(
                                                  item.productImage,
                                                  width: 50,
                                                  height: 50,
                                                  fit: BoxFit.cover,
                                                  errorBuilder: (_, __, ___) => Container(
                                                    width: 50,
                                                    height: 50,
                                                    color: Colors.grey[300],
                                                    child: const Icon(Icons.image),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(item.productName, style: const TextStyle(fontWeight: FontWeight.w500)),
                                                    Text('Qty: ${item.quantity} × ₹${item.price.toStringAsFixed(0)}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                                                  ],
                                                ),
                                              ),
                                              Text('₹${(item.quantity * item.price).toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                            ],
                                          ),
                                        )),
                                    const Divider(height: 24),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        const Text('Total:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                        Text('₹${order.total.toStringAsFixed(0)}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.blue)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}

