from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

from .models import Shopkeeper, ShopkeeperProduct, ShopkeeperOrder, ShopkeeperDocument, ShopkeeperReview
from .serializers import (
    ShopkeeperRegisterSerializer, ShopkeeperLoginSerializer, ShopkeeperSerializer,
    ShopkeeperProductSerializer, ShopkeeperOrderSerializer, ShopkeeperDocumentSerializer,
    ShopkeeperReviewSerializer
)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def shopkeeper_register(request):
    serializer = ShopkeeperRegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            shopkeeper = serializer.save()
            tokens = get_tokens_for_user(shopkeeper.user)
            return Response({
                "shopkeeper": ShopkeeperSerializer(shopkeeper).data,
                "tokens": tokens
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({
                "error": "Registration failed",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def shopkeeper_login(request):
    serializer = ShopkeeperLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user and hasattr(user, 'shopkeeper_profile'):
            tokens = get_tokens_for_user(user)
            return Response({
                "shopkeeper": ShopkeeperSerializer(user.shopkeeper_profile).data,
                "tokens": tokens
            })
        return Response({"detail": "Invalid credentials or not a shopkeeper"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Profile Management
class ShopkeeperProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            serializer = ShopkeeperSerializer(shopkeeper)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            serializer = ShopkeeperSerializer(shopkeeper, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

# Product Management
class ShopkeeperProductView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            products = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper)
            serializer = ShopkeeperProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            data = request.data.copy()
            data['shopkeeper'] = shopkeeper.id
            serializer = ShopkeeperProductSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

class ShopkeeperProductDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, product_id):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            product = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, product_id):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            product = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, product_id):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            product = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

# Order Management
class ShopkeeperOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper).order_by('-created_at')
            serializer = ShopkeeperOrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

class ShopkeeperOrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            order = get_object_or_404(ShopkeeperOrder, id=order_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperOrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, order_id):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            order = get_object_or_404(ShopkeeperOrder, id=order_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperOrderSerializer(order, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

# Document Management
class ShopkeeperDocumentView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            documents = ShopkeeperDocument.objects.filter(shopkeeper=shopkeeper)
            serializer = ShopkeeperDocumentSerializer(documents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            data = request.data.copy()
            data['shopkeeper'] = shopkeeper.id
            serializer = ShopkeeperDocumentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

# Reviews Management
class ShopkeeperReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(user=request.user)
            reviews = ShopkeeperReview.objects.filter(shopkeeper=shopkeeper).order_by('-created_at')
            serializer = ShopkeeperReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

# Dashboard Stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def shopkeeper_dashboard(request):
    try:
        shopkeeper = Shopkeeper.objects.get(user=request.user)
        
        # Get stats
        total_products = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper).count()
        total_orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper).count()
        pending_orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper, status='pending').count()
        total_revenue = sum(order.total_amount for order in ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper, status='delivered'))
        
        # Recent orders
        recent_orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper).order_by('-created_at')[:5]
        recent_orders_serializer = ShopkeeperOrderSerializer(recent_orders, many=True)
        
        return Response({
            'stats': {
                'total_products': total_products,
                'total_orders': total_orders,
                'pending_orders': pending_orders,
                'total_revenue': float(total_revenue)
            },
            'recent_orders': recent_orders_serializer.data
        }, status=status.HTTP_200_OK)
    except Shopkeeper.DoesNotExist:
        return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)
