from http.cookies import SimpleCookie


class CookieMiddleware:
    """
    Middleware to ensure cookies are properly parsed in ASGI/Daphne
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Parse cookies from Cookie header if not already parsed
        if not request.COOKIES and 'cookie' in request.headers:
            cookie = SimpleCookie()
            cookie.load(request.headers['cookie'])
            request.COOKIES = {key: morsel.value for key, morsel in cookie.items()}
        
        response = self.get_response(request)
        return response
