class Order {
  final int id;
  final String status;
  final double total;
  final String createdAt;
  final List<OrderItem> items;
  final Address? address;

  Order({
    required this.id,
    required this.status,
    required this.total,
    required this.createdAt,
    required this.items,
    this.address,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      status: json['status'] ?? 'pending',
      total: double.parse(json['total'].toString()),
      createdAt: json['created_at'] ?? '',
      items: (json['items'] as List?)?.map((i) => OrderItem.fromJson(i)).toList() ?? [],
      address: json['address'] != null ? Address.fromJson(json['address']) : null,
    );
  }
}

class OrderItem {
  final int id;
  final String productName;
  final String productImage;
  final int quantity;
  final double price;

  OrderItem({
    required this.id,
    required this.productName,
    required this.productImage,
    required this.quantity,
    required this.price,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    final product = json['product'] ?? {};
    String imageUrl = '';
    
    // Try to get image from different possible fields
    if (product['primary_image'] != null) {
      imageUrl = product['primary_image'];
    } else if (product['images'] != null && (product['images'] as List).isNotEmpty) {
      final images = product['images'] as List;
      imageUrl = images[0]['image'] ?? '';
    } else if (product['image'] != null) {
      imageUrl = product['image'];
    }
    
    return OrderItem(
      id: json['id'],
      productName: product['name'] ?? 'Unknown',
      productImage: imageUrl,
      quantity: json['quantity'] ?? 1,
      price: double.parse(json['price'].toString()),
    );
  }
}

class Address {
  final int id;
  final String label;
  final String street;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final bool isDefault;

  Address({
    required this.id,
    required this.label,
    required this.street,
    required this.city,
    required this.state,
    required this.postalCode,
    required this.country,
    required this.isDefault,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      id: json['id'],
      label: json['label'] ?? 'Home',
      street: json['street'] ?? '',
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      postalCode: json['postal_code'] ?? '',
      country: json['country'] ?? 'India',
      isDefault: json['is_default'] ?? false,
    );
  }
}
