class Product {
  final int id;
  final String title;
  final double price;
  final String description;
  final String category;
  final String image;
  final double rating;
  final int stock;

  Product({
    required this.id,
    required this.title,
    required this.price,
    required this.description,
    required this.category,
    required this.image,
    required this.rating,
    required this.stock,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    String imageUrl = '';
    
    // Handle different image formats from different APIs
    if (json['primary_image'] != null) {
      // Cart API format
      imageUrl = json['primary_image'];
    } else if (json['images'] != null && (json['images'] as List).isNotEmpty) {
      // Product list API format
      imageUrl = json['images'][0]['image'];
    } else if (json['image'] != null) {
      // Fallback
      imageUrl = json['image'];
    }
    
    return Product(
      id: json['id'],
      title: json['name'] ?? json['title'] ?? '',
      price: double.tryParse(json['price']?.toString() ?? '0') ?? 0.0,
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      image: imageUrl,
      rating: double.tryParse(json['rating']?.toString() ?? '0') ?? 0.0,
      stock: json['total_stock'] ?? json['stock'] ?? 0,
    );
  }
}
