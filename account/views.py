from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Client, Address, Wallet, PaymentMethod, Order, Review, Wishlist
from .serializers import RegisterSerializer, ClientSerializer, LoginSerializer, AddressSerializer, WalletSerializer, PaymentMethodSerializer, OrderSerializer, ReviewSerializer, WishlistSerializer
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

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
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
        return Response({
            "user": ClientSerializer(user).data,
            "tokens": tokens,
            "message": "Registration successful! Please check your email to verify your account."
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
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
                "tokens": tokens
            }
            if not user.is_email_verified:
                response_data["message"] = "Email not verified. Please verify your email."
                response_data["email_verified"] = False
            return Response(response_data)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = ClientSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        if 'username' in request.data:
            user.username = request.data['username']
        if 'email' in request.data:
            user.email = request.data['email']
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'phone_number' in request.data:
            user.phone_number = request.data['phone_number']
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']
        user.save()
        
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


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_otp_setup(request):
    """Test endpoint to verify OTP setup"""
    user = request.user
    return Response({
        "user": user.username,
        "email": user.email,
        "has_email_otp_field": hasattr(user, 'email_otp'),
        "has_otp_created_at_field": hasattr(user, 'otp_created_at'),
        "email_verified": user.is_email_verified,
        "email_backend": settings.EMAIL_BACKEND,
        "email_host": settings.EMAIL_HOST,
        "status": "OTP setup OK"
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_otp(request):
    try:
        user = request.user
        print(f"[OTP] User: {user.username}, Email: {user.email}")
        
        if user.is_email_verified:
            return Response({"error": "Email already verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        otp = str(random.randint(100000, 999999))
        print(f"[OTP] Generated OTP: {otp}")
        
        user.email_otp = otp
        user.otp_created_at = timezone.now()
        user.save(update_fields=['email_otp', 'otp_created_at'])
        print(f"[OTP] Saved to database")
        
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
        print(f"[OTP] Email sent successfully")
        return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[OTP ERROR] {str(e)}")
        print(error_trace)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_otp(request):
    try:
        user = request.user
        otp = request.data.get('otp')
        
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
        print(f"Verify OTP Error: {str(e)}")
        print(traceback.format_exc())
        return Response({"error": f"Failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
