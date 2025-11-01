import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/wallet_service.dart';
import '../providers/auth_provider.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  double _balance = 0.0;
  List<dynamic> _transactions = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadWallet();
  }

  Future<void> _loadWallet() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.token == null) return;

    final result = await WalletService().getWallet(auth.token!);
    if (!mounted) return;
    
    setState(() {
      if (result['success']) {
        _balance = double.parse(result['data']['balance'].toString());
      }
      _loading = false;
    });

    final txResult = await WalletService().getTransactions(auth.token!);
    if (!mounted) return;
    
    setState(() {
      if (txResult['success']) {
        _transactions = txResult['data'];
      }
    });
  }

  void _showAddMoneyDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Money'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: 'Amount',
            prefixText: '₹',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final amount = double.tryParse(controller.text);
              if (amount == null || amount <= 0) return;

              final auth = Provider.of<AuthProvider>(context, listen: false);
              final result = await WalletService().addMoney(auth.token!, amount);
              
              Navigator.pop(context);
              if (result['success']) {
                _loadWallet();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Money added successfully'), backgroundColor: Colors.green),
                );
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Wallet')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.blue[700]!, Colors.blue[500]!],
                    ),
                  ),
                  child: Column(
                    children: [
                      const Text('Balance', style: TextStyle(color: Colors.white70, fontSize: 16)),
                      const SizedBox(height: 8),
                      Text(
                        '₹${_balance.toStringAsFixed(2)}',
                        style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: _showAddMoneyDialog,
                        icon: const Icon(Icons.add),
                        label: const Text('Add Money'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.blue[700],
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: _transactions.isEmpty
                      ? const Center(child: Text('No transactions yet'))
                      : ListView.builder(
                          itemCount: _transactions.length,
                          itemBuilder: (_, i) {
                            final tx = _transactions[i];
                            final isCredit = tx['type'] == 'credit';
                            return ListTile(
                              leading: CircleAvatar(
                                backgroundColor: isCredit ? Colors.green[100] : Colors.red[100],
                                child: Icon(
                                  isCredit ? Icons.arrow_downward : Icons.arrow_upward,
                                  color: isCredit ? Colors.green : Colors.red,
                                ),
                              ),
                              title: Text(tx['description'] ?? 'Transaction'),
                              subtitle: Text(tx['created_at'] ?? ''),
                              trailing: Text(
                                '${isCredit ? '+' : '-'}₹${double.parse(tx['amount'].toString()).toStringAsFixed(2)}',
                                style: TextStyle(
                                  color: isCredit ? Colors.green : Colors.red,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
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
