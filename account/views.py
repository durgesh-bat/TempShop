from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse
from .models import Client, Address, Wallet, PaymentMethod, Order, Review, Wishlist
from .serializers import RegisterSerializer, ClientSerializer, LoginSerializer, AddressSerializer, WalletSerializer, PaymentMethodSerializer, OrderSerializer, ReviewSerializer, WishlistSerializer
from .validators import validate_otp, validate_email
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from product.models import Product
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import secrets
import random
from django.utils import timezone
from datetime import timedelta
from .throttles import LoginRateThrottle, RegisterRateThrottle, OTPRateThrottle
from django.db.models import Sum

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterRateThrottle])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate verification token
        token = secrets.token_urlsafe(32)
        user.email_verification_token = token
        user.save()
        
        # Send verification email
        verification_url = f"{request.scheme}://{request.get_host()}/api/auth/verify-email/{token}/"
        try:
            html_content = render_to_string('emails/welcome_email.html', {
                'username': user.username,
                'verification_url': verification_url
            })
            email = EmailMultiAlternatives(
                'Welcome to TempShop - Verify Your Email',
                f'Click the link to verify your email: {verification_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send()
        except Exception as e:
            print(f"Email sending failed: {e}")
        
        tokens = get_tokens_for_user(user)
        response = Response({
            "user": ClientSerializer(user).data,
            "message": "Registration successful! Please check your email to verify your account."
        }, status=status.HTTP_201_CREATED)
        
        response.set_cookie(
            key='access_token',
            value=tokens['access'],
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/',
            max_age=3600,
            domain=None
        )
        response.set_cookie(
            key='refresh_token',
            value=tokens['refresh'],
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/',
            max_age=604800,
            domain=None
        )
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user and isinstance(user, Client):
            tokens = get_tokens_for_user(user)
            response_data = {
                "user": ClientSerializer(user).data,
                "message": "Login successful"
            }
            if not user.is_email_verified:
                response_data["message"] = "Email not verified. Please verify your email."
                response_data["email_verified"] = False
            
            response = Response(response_data)
            response.set_cookie(
                key='access_token',
                value=tokens['access'],
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/',
                max_age=3600,
                domain=None
            )
            response.set_cookie(
                key='refresh_token',
                value=tokens['refresh'],
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/',
                max_age=604800,
                domain=None
            )
            return response
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = ClientSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        from .validators import validate_username, validate_email, validate_phone, validate_text_input
        
        user = request.user
        try:
            if 'username' in request.data:
                user.username = validate_username(request.data['username'])
            if 'email' in request.data:
                user.email = validate_email(request.data['email'])
            if 'first_name' in request.data:
                user.first_name = validate_text_input(request.data['first_name'], 'First name', 30)
            if 'last_name' in request.data:
                user.last_name = validate_text_input(request.data['last_name'], 'Last name', 30)
            if 'phone_number' in request.data:
                user.phone_number = validate_phone(request.data['phone_number'])
            if 'profile_picture' in request.FILES:
                file = request.FILES['profile_picture']
                # Validate file size (max 5MB)
                if file.size > 5 * 1024 * 1024:
                    return Response({"error": "File size exceeds 5MB"}, status=status.HTTP_400_BAD_REQUEST)
                # Validate file type
                allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
                if file.content_type not in allowed_types:
                    return Response({"error": "Invalid file type. Only images allowed"}, status=status.HTTP_400_BAD_REQUEST)
                user.profile_picture = file
            user.save()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ClientSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = request.user.addresses.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        address = get_object_or_404(Address, pk=pk, user=request.user)
        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        address = get_object_or_404(Address, pk=pk, user=request.user)
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)


class PaymentMethodView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        methods = request.user.payment_methods.all()
        serializer = PaymentMethodSerializer(methods, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PaymentMethodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentMethodDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        method = get_object_or_404(PaymentMethod, pk=pk, user=request.user)
        method.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = request.user.orders.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        from cart.models import Cart
        from .models import OrderItem
        from shopkeeper.models import ShopkeeperProduct
        import random
        
        address_id = request.data.get('address_id')
        payment_method = request.data.get('payment_method')
        
        if not address_id:
            return Response({"error": "Address is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not payment_method:
            return Response({"error": "Payment method is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        address = get_object_or_404(Address, pk=address_id, user=request.user)
        
        try:
            cart = Cart.objects.get(user=request.user)
            cart_items = cart.items.all()
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        total = sum(item.product.price * item.quantity for item in cart_items)
        
        order = Order.objects.create(
            user=request.user,
            address=address,
            total=total,
            status='pending'
        )
        
        # Validate stock before creating order
        out_of_stock_items = []
        for item in cart_items:
            available_stock = ShopkeeperProduct.objects.filter(
                product=item.product,
                stock_quantity__gte=item.quantity
            ).aggregate(total=Sum('stock_quantity'))['total'] or 0
            
            if available_stock < item.quantity:
                out_of_stock_items.append({
                    'product': item.product.name,
                    'requested': item.quantity,
                    'available': available_stock
                })
        
        if out_of_stock_items:
            return Response({
                "error": "Some items are out of stock",
                "out_of_stock": out_of_stock_items
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for item in cart_items:
            # Find shopkeeper with stock
            shopkeeper_products = ShopkeeperProduct.objects.filter(
                product=item.product,
                stock_quantity__gte=item.quantity
            ).select_related('shopkeeper')
            
            shopkeeper = None
            if shopkeeper_products.exists():
                # Randomly select a shopkeeper with stock
                shopkeeper_product = random.choice(list(shopkeeper_products))
                shopkeeper = shopkeeper_product.shopkeeper
                # Reduce stock
                shopkeeper_product.stock_quantity -= item.quantity
                shopkeeper_product.save()
                
                # Send email notification to shopkeeper
                try:
                    html_content = render_to_string('emails/shopkeeper_order_notification.html', {
                        'shopkeeper_name': shopkeeper.business_name or shopkeeper.username,
                        'customer_name': request.user.username,
                        'product_name': item.product.name,
                        'quantity': item.quantity,
                        'price': item.product.price,
                        'total': item.product.price * item.quantity,
                        'order_id': order.id
                    })
                    email = EmailMultiAlternatives(
                        f'New Order #{order.id} - {item.product.name}',
                        f'You have a new order for {item.product.name} (Qty: {item.quantity})',
                        settings.DEFAULT_FROM_EMAIL,
                        [shopkeeper.email]
                    )
                    email.attach_alternative(html_content, "text/html")
                    email.send(fail_silently=True)
                except Exception as e:
                    print(f"Failed to send shopkeeper notification: {e}")
                
                # Mark product as unavailable if all shopkeepers out of stock
                total_stock = ShopkeeperProduct.objects.filter(
                    product=item.product
                ).aggregate(total=Sum('stock_quantity'))['total'] or 0
                
                if total_stock == 0:
                    item.product.is_available = False
                    item.product.save()
            
            OrderItem.objects.create(
                order=order,
                product=item.product,
                shopkeeper=shopkeeper,
                quantity=item.quantity,
                price=item.product.price
            )
        
        cart_items.delete()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_purchase_receipt(request, order_id):
    from .receipt_generator import generate_purchase_receipt
    
    order = get_object_or_404(Order, pk=order_id, user=request.user)
    pdf_buffer = generate_purchase_receipt(order)
    
    response = HttpResponse(pdf_buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="purchase_receipt_{order.id}.pdf"'
    return response


class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = request.user.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        product = get_object_or_404(Product, pk=request.data.get('product_id'))
        review, created = Review.objects.update_or_create(
            user=request.user,
            product=product,
            defaults={'rating': request.data.get('rating'), 'comment': request.data.get('comment', '')}
        )
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_reviews(request, product_id):
    reviews = Review.objects.filter(product_id=product_id).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk, user=request.user)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist = request.user.wishlist.all()
        serializer = WishlistSerializer(wishlist, many=True)
        return Response(serializer.data)

    def post(self, request):
        product = get_object_or_404(Product, pk=request.data.get('product_id'))
        wishlist, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_product_ids(request):
    product_ids = request.user.wishlist.values_list('product_id', flat=True)
    return Response(list(product_ids))


class WishlistDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        wishlist = get_object_or_404(Wishlist, pk=pk, user=request.user)
        wishlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist_by_product(request, product_id):
    wishlist = get_object_or_404(Wishlist, user=request.user, product_id=product_id)
    wishlist.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    try:
        user = Client.objects.get(email_verification_token=token)
        user.is_email_verified = True
        user.email_verification_token = None
        user.save()
        return Response({"message": "Email verified successfully!"}, status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response({"error": "Invalid verification token"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([OTPRateThrottle])
def send_otp(request):
    try:
        user = request.user
        
        if user.is_email_verified:
            return Response({"error": "Email already verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        otp = str(random.randint(100000, 999999))
        
        user.email_otp = otp
        user.otp_created_at = timezone.now()
        user.save(update_fields=['email_otp', 'otp_created_at'])
        
        html_content = render_to_string('emails/otp_email.html', {
            'username': user.username,
            'otp': otp
        })
        email = EmailMultiAlternatives(
            'Email Verification OTP - TempShop',
            f'Your OTP for email verification is: {otp}\n\nThis OTP is valid for 10 minutes.',
            settings.DEFAULT_FROM_EMAIL,
            [user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([OTPRateThrottle])
def verify_otp(request):
    try:
        user = request.user
        otp = request.data.get('otp')
        
        # Validate OTP format
        try:
            otp = validate_otp(otp)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if OTP fields exist
        if not hasattr(user, 'email_otp') or not hasattr(user, 'otp_created_at'):
            return Response({
                "error": "Database migration required. Please run: python manage.py migrate account"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if not otp:
            return Response({"error": "OTP is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.is_email_verified:
            return Response({"error": "Email already verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.email_otp or not user.otp_created_at:
            return Response({"error": "No OTP found. Please request a new one"}, status=status.HTTP_400_BAD_REQUEST)
        
        if timezone.now() > user.otp_created_at + timedelta(minutes=10):
            return Response({"error": "OTP expired. Please request a new one"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.email_otp != otp:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_email_verified = True
        user.email_otp = None
        user.otp_created_at = None
        user.save(update_fields=['is_email_verified', 'email_otp', 'otp_created_at'])
        
        return Response({"message": "Email verified successfully!"}, status=status.HTTP_200_OK)
    except Exception as e:
        import traceback
        return Response({"error": f"Failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for frontend"""
    return Response({'detail': 'CSRF cookie set'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logout user by revoking tokens and clearing cookies"""
    from .models import RevokedToken
    from rest_framework_simplejwt.tokens import RefreshToken
    
    # Revoke access token
    access_token = request.COOKIES.get('access_token')
    if access_token:
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            token = AccessToken(access_token)
            RevokedToken.objects.create(
                jti=token['jti'],
                user=request.user,
                expires_at=timezone.datetime.fromtimestamp(token['exp'], tz=timezone.utc),
                token_type='access'
            )
        except Exception:
            pass
    
    # Revoke refresh token
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            RevokedToken.objects.create(
                jti=token['jti'],
                user=request.user,
                expires_at=timezone.datetime.fromtimestamp(token['exp'], tz=timezone.utc),
                token_type='refresh'
            )
        except Exception:
            pass
    
    response = Response({'message': 'Logged out successfully'})
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    response.delete_cookie('csrftoken')
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """Refresh access token using refresh token from cookie"""
    refresh = request.COOKIES.get('refresh_token')
    if not refresh:
        return Response({'error': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        refresh_token_obj = RefreshToken(refresh)
        access_token = str(refresh_token_obj.access_token)
        
        response = Response({'message': 'Token refreshed'})
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/',
            max_age=3600,
            domain=None
        )
        return response
    except Exception as e:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
