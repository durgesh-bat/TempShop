import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:badges/badges.dart' as badges;
import '../models/product.dart';
import '../services/api_service.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/notification_provider.dart';
import '../widgets/product_card.dart';
import 'cart_screen.dart';
import 'wishlist_screen.dart';
import 'search_screen.dart';
import 'login_screen.dart';
import 'profile_screen.dart';
import 'orders_screen.dart';
import 'notifications_screen.dart';
import 'category_products_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _api = ApiService();
  List<Product> _products = [];
  List<Map<String, dynamic>> _categories = [];
  Map<String, List<Product>> _productsByCategory = {};
  bool _loading = true;

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    if (!mounted) return;
    setState(() => _loading = true);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final products = await _api.getProducts();
    final categories = await _api.getCategoriesWithImages();
    final recentlyViewed = await _api.getRecentlyViewed(auth.token);
    
    final Map<String, List<Product>> grouped = {};
    if (recentlyViewed.isNotEmpty) {
      grouped['Recently Viewed'] = recentlyViewed;
    }
    for (var cat in categories) {
      grouped[cat['name']] = products.where((p) => p.category == cat['name']).toList();
    }
    
    if (!mounted) return;
    setState(() {
      _products = products;
      _categories = categories;
      _productsByCategory = grouped;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final notifications = Provider.of<NotificationProvider>(context);

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2563EB), Color(0xFF3B82F6)],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Image.asset(
                'assets/images/logo.png',
                height: 32,
                width: 32,
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(width: 8),
            const Text('TempShop', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SearchScreen()),
            ),
          ),
          if (auth.isAuthenticated)
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: badges.Badge(
                badgeContent: Text(
                  '${notifications.unreadCount}',
                  style: const TextStyle(color: Colors.white, fontSize: 10),
                ),
                showBadge: notifications.unreadCount > 0,
                child: IconButton(
                  icon: const Icon(Icons.notifications_outlined),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                  ),
                ),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {
              if (auth.isAuthenticated) {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const WishlistScreen()));
              } else {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
              }
            },
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: badges.Badge(
              badgeContent: Text(
                '${cart.itemCount}',
                style: const TextStyle(color: Colors.white, fontSize: 10),
              ),
              showBadge: cart.itemCount > 0,
              child: IconButton(
                icon: const Icon(Icons.shopping_cart),
                onPressed: () {
                  if (auth.isAuthenticated) {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const CartScreen()));
                  } else {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                  }
                },
              ),
            ),
          ),
        ],

      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: ListView(
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.blue[700]!, Colors.blue[500]!],
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${_getGreeting()}${auth.isAuthenticated ? ", ${auth.username}" : ""}!',
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Welcome to TempShop',
                          style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.9)),
                        ),
                      ],
                    ),
                  ),
                  if (_categories.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: SizedBox(
                        height: 100,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          itemCount: _categories.length,
                          itemBuilder: (_, i) => _buildCategoryCard(_categories[i]),
                        ),
                      ),
                    ),
                  if (_productsByCategory.containsKey('Recently Viewed'))
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
                          child: Row(
                            children: [
                              const Icon(Icons.history, color: Color(0xFF2563EB)),
                              const SizedBox(width: 8),
                              const Text(
                                'Recently Viewed',
                                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                          height: 280,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            itemCount: _productsByCategory['Recently Viewed']!.length,
                            itemBuilder: (_, i) => SizedBox(
                              width: 160,
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: ProductCard(product: _productsByCategory['Recently Viewed']![i]),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  if (_products.isNotEmpty) ..._categories.map((category) {
                    final products = _productsByCategory[category['name']] ?? [];
                    if (products.isEmpty) return const SizedBox.shrink();
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                category['name'],
                                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                '${products.length} items',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                          height: 280,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            itemCount: products.length,
                            itemBuilder: (_, i) => SizedBox(
                              width: 160,
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: ProductCard(product: products[i]),
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  }),
                  const SizedBox(height: 20),
                ],
              ),
            ),
    );
  }

  Widget _buildCategoryCard(Map<String, dynamic> category) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => CategoryProductsScreen(categoryName: category['name']),
        ),
      ),
      child: Container(
        width: 100,
        margin: const EdgeInsets.symmetric(horizontal: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                category['image'] ?? '',
                width: 60,
                height: 60,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Icon(Icons.category, size: 32, color: Color(0xFF2563EB)),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              category['name'] ?? '',
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}


