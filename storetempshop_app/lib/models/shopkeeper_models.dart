class Shopkeeper {
  final String id;
  final String username;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? phoneNumber;
  final String? alternatePhoneNumber;
  final String? address;
  final String? profilePicture;
  final String? businessName;
  final String? businessType;
  final bool isVerified;
  final bool? emailVerified;
  final double? longitude;
  final double? latitude;
  final DateTime dateJoined;

  Shopkeeper({
    required this.id,
    required this.username,
    required this.email,
    this.firstName,
    this.lastName,
    this.phoneNumber,
    this.alternatePhoneNumber,
    this.address,
    this.profilePicture,
    this.businessName,
    this.businessType,
    required this.isVerified,
    this.emailVerified,
    this.longitude,
    this.latitude,
    required this.dateJoined,
  });

  factory Shopkeeper.fromJson(Map<String, dynamic> json) {
    return Shopkeeper(
      id: json['id'].toString(),
      username: json['username'],
      email: json['email'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      phoneNumber: json['phone_number'],
      alternatePhoneNumber: json['alternate_phone_number'],
      address: json['address'],
      profilePicture: json['profile_picture'],
      businessName: json['business_name'],
      businessType: json['business_type'],
      isVerified: json['is_verified'] ?? false,
      emailVerified: json['email_verified'],
      longitude: json['longitude']?.toDouble(),
      latitude: json['latitude']?.toDouble(),
      dateJoined: DateTime.parse(json['date_joined']),
    );
  }
}

class ShopkeeperProduct {
  final String id;
  final String productId;
  final String name;
  final double price;
  final String? description;
  final String? category;
  final int stockQuantity;
  final String? image;
  final bool isAvailable;

  ShopkeeperProduct({
    required this.id,
    required this.productId,
    required this.name,
    required this.price,
    this.description,
    this.category,
    required this.stockQuantity,
    this.image,
    required this.isAvailable,
  });

  factory ShopkeeperProduct.fromJson(Map<String, dynamic> json) {
    return ShopkeeperProduct(
      id: json['id'].toString(),
      productId: json['product'].toString(),
      name: json['name'],
      price: double.parse(json['price'].toString()),
      description: json['description'],
      category: json['category'],
      stockQuantity: json['stock_quantity'],
      image: json['image'],
      isAvailable: json['is_available'] ?? true,
    );
  }
}

class CustomerOrder {
  final String id;
  final String orderId;
  final String customerName;
  final String customerEmail;
  final String customerPhone;
  final String productName;
  final int quantity;
  final double price;
  final double total;
  final String status;
  final ShippingAddress shippingAddress;
  final DateTime createdAt;

  CustomerOrder({
    required this.id,
    required this.orderId,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
    required this.productName,
    required this.quantity,
    required this.price,
    required this.total,
    required this.status,
    required this.shippingAddress,
    required this.createdAt,
  });

  factory CustomerOrder.fromJson(Map<String, dynamic> json) {
    return CustomerOrder(
      id: json['id'].toString(),
      orderId: json['order_id'].toString(),
      customerName: json['customer_name'],
      customerEmail: json['customer_email'],
      customerPhone: json['customer_phone'],
      productName: json['product_name'],
      quantity: json['quantity'],
      price: double.parse(json['price'].toString()),
      total: double.parse(json['total'].toString()),
      status: json['status'],
      shippingAddress: ShippingAddress.fromJson(json['shipping_address']),
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class ShippingAddress {
  final String label;
  final String street;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final String fullAddress;

  ShippingAddress({
    required this.label,
    required this.street,
    required this.city,
    required this.state,
    required this.postalCode,
    required this.country,
    required this.fullAddress,
  });

  factory ShippingAddress.fromJson(Map<String, dynamic> json) {
    return ShippingAddress(
      label: json['label'] ?? 'N/A',
      street: json['street'] ?? 'N/A',
      city: json['city'] ?? 'N/A',
      state: json['state'] ?? 'N/A',
      postalCode: json['postal_code'] ?? 'N/A',
      country: json['country'] ?? 'N/A',
      fullAddress: json['full_address'] ?? 'N/A',
    );
  }
}

class DashboardStats {
  final int totalProducts;
  final int outOfStock;
  final int lowStock;
  final int totalOrders;
  final int pendingOrders;
  final double totalRevenue;
  final double commissionRate;
  final double totalCommission;
  final double netEarnings;

  DashboardStats({
    required this.totalProducts,
    required this.outOfStock,
    required this.lowStock,
    required this.totalOrders,
    required this.pendingOrders,
    required this.totalRevenue,
    required this.commissionRate,
    required this.totalCommission,
    required this.netEarnings,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalProducts: json['total_products'],
      outOfStock: json['out_of_stock'],
      lowStock: json['low_stock'],
      totalOrders: json['total_orders'],
      pendingOrders: json['pending_orders'],
      totalRevenue: double.parse(json['total_revenue'].toString()),
      commissionRate: double.parse(json['commission_rate'].toString()),
      totalCommission: double.parse(json['total_commission'].toString()),
      netEarnings: double.parse(json['net_earnings'].toString()),
    );
  }
}

class InventoryItem {
  final String id;
  final String productId;
  final String name;
  final int stockQuantity;
  final int? previousStock;
  final double price;
  final bool isAvailable;
  final String status;

  InventoryItem({
    required this.id,
    required this.productId,
    required this.name,
    required this.stockQuantity,
    this.previousStock,
    required this.price,
    required this.isAvailable,
    required this.status,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    return InventoryItem(
      id: json['id'].toString(),
      productId: json['product_id'].toString(),
      name: json['name'],
      stockQuantity: json['stock_quantity'],
      previousStock: json['previous_stock'],
      price: double.parse(json['price'].toString()),
      isAvailable: json['is_available'],
      status: json['status'],
    );
  }
}