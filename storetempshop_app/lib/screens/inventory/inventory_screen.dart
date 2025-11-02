import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/shopkeeper_models.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> with SingleTickerProviderStateMixin {
  List<InventoryItem> _inventory = [];
  List<InventoryItem> _filteredInventory = [];
  bool _isLoading = true;
  String _selectedFilter = 'All';
  late TabController _tabController;

  final List<String> _filters = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _filters.length, vsync: this);
    _loadInventory();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadInventory() async {
    setState(() => _isLoading = true);
    
    try {
      final inventory = await ApiService.getInventory();
      setState(() {
        _inventory = inventory;
        _filterInventory();
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading inventory: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _filterInventory() {
    switch (_selectedFilter) {
      case 'All':
        _filteredInventory = _inventory;
        break;
      case 'In Stock':
        _filteredInventory = _inventory.where((item) => item.stockQuantity > 10).toList();
        break;
      case 'Low Stock':
        _filteredInventory = _inventory.where((item) => item.stockQuantity > 0 && item.stockQuantity <= 10).toList();
        break;
      case 'Out of Stock':
        _filteredInventory = _inventory.where((item) => item.stockQuantity == 0).toList();
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Inventory Management'),
        backgroundColor: Colors.blue[600],
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: _filters.map((filter) => Tab(text: filter)).toList(),
          onTap: (index) {
            setState(() {
              _selectedFilter = _filters[index];
              _filterInventory();
            });
          },
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadInventory,
              child: Column(
                children: [
                  // Summary Cards
                  Container(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Expanded(
                          child: _buildSummaryCard(
                            'Total Items',
                            _inventory.length.toString(),
                            Icons.inventory,
                            Colors.blue,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildSummaryCard(
                            'Low Stock',
                            _inventory.where((item) => item.stockQuantity > 0 && item.stockQuantity <= 10).length.toString(),
                            Icons.warning,
                            Colors.orange,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildSummaryCard(
                            'Out of Stock',
                            _inventory.where((item) => item.stockQuantity == 0).length.toString(),
                            Icons.error,
                            Colors.red,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // Inventory List
                  Expanded(
                    child: _filteredInventory.isEmpty
                        ? _buildEmptyState()
                        : ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: _filteredInventory.length,
                            itemBuilder: (context, index) {
                              final item = _filteredInventory[index];
                              return _buildInventoryCard(item);
                            },
                          ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildSummaryCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, size: 24, color: color),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inventory_2_outlined,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            _selectedFilter == 'All' ? 'No Inventory Items' : 'No $_selectedFilter Items',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _selectedFilter == 'All' 
                ? 'Add products to see inventory'
                : 'No items match the selected filter',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInventoryCard(InventoryItem item) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '₹${item.price.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.green[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getStatusColor(item.status),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        item.status,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Switch(
                      value: item.isAvailable,
                      onChanged: (value) => _toggleAvailability(item),
                      activeColor: Colors.green,
                    ),
                  ],
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            // Stock Information
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.inventory,
                        size: 20,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (item.previousStock != null) ...[
                              Row(
                                children: [
                                  Text(
                                    'Previous Stock: ',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[500],
                                    ),
                                  ),
                                  Text(
                                    '${item.previousStock} units',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[700],
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                            ],
                            Row(
                              children: [
                                Text(
                                  'Current Stock: ',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                Text(
                                  '${item.stockQuantity} units',
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (item.previousStock != null) ...[
                                  const SizedBox(width: 8),
                                  _buildStockChangeIndicator(item.previousStock!, item.stockQuantity),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton.icon(
                        onPressed: () => _showUpdateStockDialog(item),
                        icon: const Icon(Icons.edit, size: 16),
                        label: const Text('Update'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue[600],
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          minimumSize: Size.zero,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Stock Level Indicator
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: item.stockQuantity / 100, // Assuming max stock of 100 for visualization
              backgroundColor: Colors.grey[300],
              valueColor: AlwaysStoppedAnimation<Color>(_getStockLevelColor(item.stockQuantity)),
            ),
          ],
        ),
      ),
    );
  }

  void _showUpdateStockDialog(InventoryItem item) {
    final controller = TextEditingController(text: item.stockQuantity.toString());
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Update Stock - ${item.name}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Stock Quantity',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.inventory),
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  if (item.previousStock != null) ...[
                    Row(
                      children: [
                        Icon(Icons.history, color: Colors.blue[600], size: 20),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Previous stock: ${item.previousStock} units',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.blue[600],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                  ],
                  Row(
                    children: [
                      Icon(Icons.info, color: Colors.blue[600], size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Current stock: ${item.stockQuantity} units',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.blue[700],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final newStock = int.tryParse(controller.text);
              if (newStock != null && newStock >= 0) {
                Navigator.pop(context);
                await _updateStock(item, newStock);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Please enter a valid stock quantity')),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue[600],
              foregroundColor: Colors.white,
            ),
            child: const Text('Update'),
          ),
        ],
      ),
    );
  }

  Future<void> _updateStock(InventoryItem item, int newStock) async {
    try {
      final success = await ApiService.updateStock(item.id, newStock);
      if (success) {
        await _loadInventory();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Stock updated successfully')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update stock')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error updating stock: $e')),
      );
    }
  }

  Future<void> _toggleAvailability(InventoryItem item) async {
    try {
      final success = await ApiService.toggleAvailability(item.id);
      if (success) {
        await _loadInventory();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              item.isAvailable 
                  ? 'Product disabled successfully' 
                  : 'Product enabled successfully'
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update product availability')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error updating availability: $e')),
      );
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'In Stock':
        return Colors.green;
      case 'Low Stock':
        return Colors.orange;
      case 'Out of Stock':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Color _getStockLevelColor(int stock) {
    if (stock == 0) return Colors.red;
    if (stock <= 10) return Colors.orange;
    return Colors.green;
  }

  Widget _buildStockChangeIndicator(int previousStock, int currentStock) {
    final difference = currentStock - previousStock;
    if (difference == 0) return const SizedBox.shrink();
    
    final isIncrease = difference > 0;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: isIncrease ? Colors.green[100] : Colors.red[100],
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isIncrease ? Icons.arrow_upward : Icons.arrow_downward,
            size: 12,
            color: isIncrease ? Colors.green[700] : Colors.red[700],
          ),
          const SizedBox(width: 2),
          Text(
            '${difference.abs()}',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: isIncrease ? Colors.green[700] : Colors.red[700],
            ),
          ),
        ],
      ),
    );
  }
}