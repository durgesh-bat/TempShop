class ApiConfig {
  static const String baseUrl = 'https://9d31f16038c3.ngrok-free.app/api';
  
  // Shopkeeper endpoints
  static const String shopkeeperRegister = '$baseUrl/shopkeeper/register/';
  static const String shopkeeperLogin = '$baseUrl/shopkeeper/login/';
  static const String shopkeeperProfile = '$baseUrl/shopkeeper/profile/';
  static const String shopkeeperDashboard = '$baseUrl/shopkeeper/dashboard/';
  static const String shopkeeperProducts = '$baseUrl/shopkeeper/products/';
  static const String shopkeeperOrders = '$baseUrl/shopkeeper/customer-orders/';
  static const String shopkeeperInventory = '$baseUrl/shopkeeper/inventory/';
  static const String shopkeeperPayments = '$baseUrl/shopkeeper/payments/';
  static const String shopkeeperAnalytics = '$baseUrl/shopkeeper/analytics/';
  static const String shopkeeperDocuments = '$baseUrl/shopkeeper/documents/';
  static const String shopkeeperReviews = '$baseUrl/shopkeeper/reviews/';
  
  // Helper methods
  static String updateStock(String productId) => '$shopkeeperInventory$productId/stock/';
  static String toggleAvailability(String productId) => '$shopkeeperInventory$productId/toggle/';
  static String productDetail(String productId) => '$shopkeeperProducts$productId/';
  static String orderReceipt(String orderItemId) => '$baseUrl/shopkeeper/order-items/$orderItemId/receipt/';
  
  // Use ShopkeeperProduct ID for stock operations
  static String updateProductStock(String shopkeeperProductId) => '$shopkeeperInventory$shopkeeperProductId/stock/';
  static String toggleProductAvailability(String shopkeeperProductId) => '$shopkeeperInventory$shopkeeperProductId/toggle/';
}