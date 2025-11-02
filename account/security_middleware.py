import re
from django.http import JsonResponse

class SecurityMiddleware:
    """Middleware to detect and block common attack patterns"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Common attack patterns
        self.sql_injection_patterns = [
            r"(\bunion\b.*\bselect\b)", r"(\bor\b.*=.*)", r"(\band\b.*=.*)",
            r"(drop\s+table)", r"(insert\s+into)", r"(delete\s+from)",
            r"(update\s+.*\s+set)", r"(exec\s*\()", r"(execute\s*\()",
        ]
        
        self.xss_patterns = [
            r"<script[^>]*>.*?</script>", r"javascript:", r"onerror\s*=",
            r"onclick\s*=", r"onload\s*=", r"<iframe", r"<object",
            r"<embed", r"eval\s*\(", r"expression\s*\(",
        ]
        
        self.path_traversal_patterns = [
            r"\.\./", r"\.\.\\", r"%2e%2e", r"%252e%252e",
        ]
        
        self.email_injection_patterns = [
            r'\r\n', r'%0d%0a', r'\ncc:', r'\nbcc:', r'\nto:',
            r'content-type:', r'mime-version:',
        ]
    
    def __call__(self, request):
        # Check request body for attacks (skip multipart data)
        if request.method in ['POST', 'PUT', 'PATCH']:
            content_type = request.META.get('CONTENT_TYPE', '')
            if hasattr(request, 'body') and request.body and 'multipart/form-data' not in content_type:
                body_str = request.body.decode('utf-8', errors='ignore').lower()
                
                # Check for SQL injection
                for pattern in self.sql_injection_patterns:
                    if re.search(pattern, body_str, re.IGNORECASE):
                        return JsonResponse(
                            {'error': 'Invalid request - potential SQL injection detected'},
                            status=400
                        )
                
                # Check for XSS
                for pattern in self.xss_patterns:
                    if re.search(pattern, body_str, re.IGNORECASE):
                        return JsonResponse(
                            {'error': 'Invalid request - potential XSS detected'},
                            status=400
                        )
                
                # Check for email header injection
                for pattern in self.email_injection_patterns:
                    if re.search(pattern, body_str, re.IGNORECASE):
                        return JsonResponse(
                            {'error': 'Invalid request - email header injection detected'},
                            status=400
                        )
            elif 'multipart/form-data' in content_type:
                # Skip security checks for multipart data
                pass
        
        # Check URL for path traversal
        path = request.path.lower()
        for pattern in self.path_traversal_patterns:
            if re.search(pattern, path):
                return JsonResponse(
                    {'error': 'Invalid request - potential path traversal detected'},
                    status=400
                )
        
        # Check for suspicious headers
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        suspicious_agents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'burp']
        if any(agent in user_agent for agent in suspicious_agents):
            return JsonResponse(
                {'error': 'Access denied'},
                status=403
            )
        
        response = self.get_response(request)
        
        # Add security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        return response
