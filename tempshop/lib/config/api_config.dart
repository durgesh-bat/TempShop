class ApiConfig {
  static const String baseUrl = 'https://7743105dc1df.ngrok-free.app/api';
  
  static String get authBaseUrl => '$baseUrl/auth';
  static String get cartBaseUrl => baseUrl;
  static String get productBaseUrl => baseUrl;
}
