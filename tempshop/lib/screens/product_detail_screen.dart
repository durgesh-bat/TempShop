import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../models/product.dart';
import '../providers/cart_provider.dart';
import '../providers/wishlist_provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../widgets/product_card.dart';
import 'login_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  List<Product> _similarProducts = [];
  List<Map<String, dynamic>> _reviews = [];
  bool _loadingSimilar = true;
  bool _loadingReviews = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final similar = await ApiService().getSimilarProducts(widget.product.id);
    final reviews = await AuthService().getReviews(auth.token ?? '');
    
    if (mounted) {
      setState(() {
        _similarProducts = similar;
        _loadingSimilar = false;
        if (reviews['success']) {
          _reviews = List<Map<String, dynamic>>.from(reviews['data'] ?? []);
        }
        _loadingReviews = false;
      });
    }
  }

  Future<void> _showReviewDialog() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isAuthenticated) {
      await Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
      return;
    }

    double rating = 5;
    final commentController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Write Review'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RatingBar.builder(
              initialRating: 5,
              minRating: 1,
              itemBuilder: (_, __) => const Icon(Icons.star, color: Colors.amber),
              onRatingUpdate: (r) => rating = r,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: commentController,
              decoration: const InputDecoration(labelText: 'Comment', border: OutlineInputBorder()),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              final result = await AuthService().createReview(
                auth.token!,
                widget.product.id,
                rating.toInt(),
                commentController.text,
              );
              Navigator.pop(context);
              if (result['success']) {
                _loadData();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Review submitted!'), backgroundColor: Colors.green),
                );
              }
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context, listen: false);
    final wishlist = Provider.of<WishlistProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final productReviews = _reviews.where((r) => r['product'] == widget.product.id).toList();

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 350,
            pinned: true,
            backgroundColor: Colors.white,
            flexibleSpace: FlexibleSpaceBar(
              background: Hero(
                tag: 'product-${widget.product.id}',
                child: CachedNetworkImage(
                  imageUrl: widget.product.image,
                  fit: BoxFit.contain,
                  placeholder: (_, __) => Container(
                    color: Colors.grey[200],
                    child: const Center(child: CircularProgressIndicator()),
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: Icon(
                  wishlist.isInWishlist(widget.product.id) ? Icons.favorite : Icons.favorite_border,
                  color: Colors.red,
                ),
                onPressed: () async {
                  if (!auth.isAuthenticated) {
                    await Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    );
                    return;
                  }
                  final success = await wishlist.toggle(widget.product);
                  if (mounted) {
                    final isInWishlist = wishlist.isInWishlist(widget.product.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Row(
                          children: [
                            Icon(success ? Icons.check_circle : Icons.error, color: Colors.white),
                            const SizedBox(width: 12),
                            Text(success 
                              ? (isInWishlist ? 'Added to wishlist!' : 'Removed from wishlist!')
                              : 'Failed to update wishlist'),
                          ],
                        ),
                        backgroundColor: success ? (isInWishlist ? Colors.green : Colors.orange) : Colors.red,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  }
                },
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.product.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        RatingBarIndicator(
                          rating: widget.product.rating,
                          itemBuilder: (_, __) => const Icon(Icons.star, color: Colors.amber),
                          itemCount: 5,
                          itemSize: 22,
                        ),
                        const SizedBox(width: 8),
                        Text('${widget.product.rating}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2563EB).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Price', style: TextStyle(color: Colors.grey, fontSize: 14)),
                              const SizedBox(height: 4),
                              Text('₹${widget.product.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: widget.product.stock > 0 ? Colors.green : Colors.red,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(widget.product.stock > 0 ? 'In Stock (${widget.product.stock})' : 'Out of Stock', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(color: Colors.blue[50], borderRadius: BorderRadius.circular(8)),
                      child: Text(widget.product.category, style: const TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.w600)),
                    ),
                    const SizedBox(height: 24),
                    const Text('Description', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Text(widget.product.description, style: TextStyle(fontSize: 15, height: 1.6, color: Colors.grey[700])),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Reviews', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        TextButton.icon(onPressed: _showReviewDialog, icon: const Icon(Icons.rate_review), label: const Text('Write Review')),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _loadingReviews
                        ? const Center(child: CircularProgressIndicator())
                        : productReviews.isEmpty
                            ? const Text('No reviews yet', style: TextStyle(color: Colors.grey))
                            : Column(
                                children: productReviews.map((review) => Card(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  child: Padding(
                                    padding: const EdgeInsets.all(12),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            RatingBarIndicator(
                                              rating: (review['rating'] ?? 0).toDouble(),
                                              itemBuilder: (_, __) => const Icon(Icons.star, color: Colors.amber),
                                              itemCount: 5,
                                              itemSize: 16,
                                            ),
                                            const SizedBox(width: 8),
                                            Text(review['user'] ?? 'Anonymous', style: const TextStyle(fontWeight: FontWeight.bold)),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        Text(review['comment'] ?? ''),
                                      ],
                                    ),
                                  ),
                                )).toList(),
                              ),
                    const SizedBox(height: 24),
                    if (_similarProducts.isNotEmpty) ...[
                      const Text('Similar Products', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 280,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _similarProducts.length,
                          itemBuilder: (_, i) => SizedBox(
                            width: 160,
                            child: Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ProductCard(product: _similarProducts[i]),
                            ),
                          ),
                        ),
                      ),
                    ],
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, -2))]),
        child: SafeArea(
          child: ElevatedButton(
            onPressed: widget.product.stock > 0
                ? () async {
                    if (!auth.isAuthenticated) {
                      final result = await Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      );
                      if (result != true) return;
                    }
                    
                    final success = await cart.addItem(widget.product);
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Row(
                            children: [
                              Icon(success ? Icons.check_circle : Icons.error, color: Colors.white),
                              const SizedBox(width: 12),
                              Text(success ? 'Added to cart successfully!' : 'Failed to add to cart'),
                            ],
                          ),
                          backgroundColor: success ? Colors.green : Colors.red,
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    }
                  }
                : null,
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.shopping_cart, color: Colors.white),
                const SizedBox(width: 8),
                Text(widget.product.stock > 0 ? 'Add to Cart' : 'Out of Stock', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
