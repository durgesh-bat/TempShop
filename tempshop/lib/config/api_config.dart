class ApiConfig {
  static const String baseUrl = 'https://9d31f16038c3.ngrok-free.app/api';
  
  static String get authBaseUrl => '$baseUrl/auth';
  static String get cartBaseUrl => baseUrl;
  static String get productBaseUrl => baseUrl;
}
