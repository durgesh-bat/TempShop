from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
import uuid

from .models import Shopkeeper, ShopkeeperProduct, ShopkeeperOrder, ShopkeeperDocument, ShopkeeperReview
from .serializers import (
    ShopkeeperRegisterSerializer, ShopkeeperLoginSerializer, ShopkeeperSerializer,
    ShopkeeperProductSerializer, ShopkeeperOrderSerializer, ShopkeeperDocumentSerializer,
    ShopkeeperReviewSerializer
)
from django.db.models import Sum

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
            tokens = get_tokens_for_user(shopkeeper)
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
        try:
            shopkeeper = Shopkeeper.objects.get(username=username)
            print(f"Found shopkeeper: {shopkeeper.username}, is_staff: {shopkeeper.is_staff}")
            if shopkeeper.check_password(password):
                print("Password is correct")
                if shopkeeper.is_staff:
                    tokens = get_tokens_for_user(shopkeeper)
                    return Response({
                        "shopkeeper": ShopkeeperSerializer(shopkeeper).data,
                        "tokens": tokens
                    })
                else:
                    print("User is not staff")
                    return Response({"detail": "Not authorized as shopkeeper"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                print("Password is incorrect")
        except Shopkeeper.DoesNotExist:
            print(f"Shopkeeper not found: {username}")
        return Response({"detail": "Invalid credentials or not a shopkeeper"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Profile Management
class ShopkeeperProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            serializer = ShopkeeperSerializer(shopkeeper)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Shopkeeper profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
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
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            products = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper)
            serializer = ShopkeeperProductSerializer(products, many=True)
            return Response(serializer.data)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        from product.models import Product, Category, ProductImage
        from django.utils.text import slugify
        
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Create Product first
        name = request.data.get('name')
        price = request.data.get('price')
        description = request.data.get('description', '')
        category_name = request.data.get('category', 'other')
        stock_quantity = request.data.get('stock_quantity', 0)
        image = request.FILES.get('image')
        
        if not name or not price:
            return Response({"error": "Name and price are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create category
        category, _ = Category.objects.get_or_create(
            name=category_name.capitalize(),
            defaults={'slug': slugify(category_name)}
        )
        
        # Create product
        product = Product.objects.create(
            name=name,
            slug=slugify(name) + '-' + str(uuid.uuid4())[:8],
            category=category,
            price=price,
            description=description,
            is_available=True
        )
        
        # Add image if provided
        if image:
            ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=True,
                order=0
            )
        
        # Link to shopkeeper
        shopkeeper_product = ShopkeeperProduct.objects.create(
            shopkeeper=shopkeeper,
            product=product,
            stock_quantity=stock_quantity
        )
        
        serializer = ShopkeeperProductSerializer(shopkeeper_product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ShopkeeperProductDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, product_id):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            product = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, product_id):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            product = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, product_id):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            product = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

# Order Management
class ShopkeeperOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper).order_by('-created_at')
            serializer = ShopkeeperOrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

class ShopkeeperOrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            order = get_object_or_404(ShopkeeperOrder, id=order_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperOrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, order_id):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            order = get_object_or_404(ShopkeeperOrder, id=order_id, shopkeeper=shopkeeper)
            serializer = ShopkeeperOrderSerializer(order, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

# Document Management
class ShopkeeperDocumentView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            documents = ShopkeeperDocument.objects.filter(shopkeeper=shopkeeper)
            serializer = ShopkeeperDocumentSerializer(documents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            data = request.data.copy()
            data['shopkeeper'] = shopkeeper.id
            serializer = ShopkeeperDocumentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

# Reviews Management
class ShopkeeperReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            shopkeeper = Shopkeeper.objects.get(id=request.user.id)
            reviews = ShopkeeperReview.objects.filter(shopkeeper=shopkeeper).order_by('-created_at')
            serializer = ShopkeeperReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shopkeeper.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

# Inventory Management
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_overview(request):
    try:
        shopkeeper = Shopkeeper.objects.get(id=request.user.id)
        products = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper).select_related('product')
        
        inventory_data = []
        for sp in products:
            inventory_data.append({
                'id': sp.id,
                'product_id': sp.product.id,
                'name': sp.product.name,
                'stock_quantity': sp.stock_quantity,
                'price': float(sp.product.price),
                'is_available': sp.product.is_available,
                'status': 'Out of Stock' if sp.stock_quantity == 0 else 'Low Stock' if sp.stock_quantity <= 10 else 'In Stock'
            })
        
        return Response(inventory_data, status=status.HTTP_200_OK)
    except Shopkeeper.DoesNotExist:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_stock(request, product_id):
    try:
        shopkeeper = Shopkeeper.objects.get(id=request.user.id)
        sp = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
        
        stock_quantity = request.data.get('stock_quantity')
        if stock_quantity is not None:
            sp.stock_quantity = int(stock_quantity)
            sp.product.is_available = sp.stock_quantity > 0
            sp.product.save()
            sp.save()
        
        return Response({
            'id': sp.id,
            'stock_quantity': sp.stock_quantity,
            'is_available': sp.product.is_available,
            'message': 'Stock updated successfully'
        }, status=status.HTTP_200_OK)
    except Shopkeeper.DoesNotExist:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_availability(request, product_id):
    try:
        shopkeeper = Shopkeeper.objects.get(id=request.user.id)
        sp = get_object_or_404(ShopkeeperProduct, id=product_id, shopkeeper=shopkeeper)
        
        sp.product.is_available = not sp.product.is_available
        sp.product.save()
        
        return Response({
            'id': sp.id,
            'is_available': sp.product.is_available,
            'message': f"Product {'enabled' if sp.product.is_available else 'disabled'}"
        }, status=status.HTTP_200_OK)
    except Shopkeeper.DoesNotExist:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

# Payment & Commission Tracking
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    try:
        shopkeeper = Shopkeeper.objects.get(id=request.user.id)
        orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper, status='delivered').order_by('-created_at')
        
        commission_rate = 0.15
        payments = []
        for order in orders:
            order_amount = float(order.total_amount)
            commission = order_amount * commission_rate
            net_payment = order_amount - commission
            
            payments.append({
                'order_id': order.id,
                'customer_name': order.customer_name,
                'order_amount': order_amount,
                'commission_rate': commission_rate,
                'commission_deducted': commission,
                'net_payment': net_payment,
                'date': order.created_at,
                'status': order.status
            })
        
        total_revenue = sum(p['order_amount'] for p in payments)
        total_commission = sum(p['commission_deducted'] for p in payments)
        total_net = sum(p['net_payment'] for p in payments)
        
        return Response({
            'summary': {
                'total_revenue': total_revenue,
                'total_commission': total_commission,
                'total_net_earnings': total_net,
                'commission_rate': commission_rate
            },
            'payments': payments
        }, status=status.HTTP_200_OK)
    except Shopkeeper.DoesNotExist:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

# Product Views Analytics
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product_analytics(request):
    try:
        shopkeeper = Shopkeeper.objects.get(id=request.user.id)
        products = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper).select_related('product')
        
        analytics = []
        for sp in products:
            # Get order count for this product
            order_count = ShopkeeperOrder.objects.filter(
                shopkeeper=shopkeeper,
                order_details__contains=sp.product.name
            ).count()
            
            analytics.append({
                'product_id': sp.product.id,
                'name': sp.product.name,
                'price': float(sp.product.price),
                'stock': sp.stock_quantity,
                'orders': order_count,
                'revenue': float(sp.product.price) * order_count,
                'rating': sp.product.rating
            })
        
        # Sort by orders (most popular first)
        analytics.sort(key=lambda x: x['orders'], reverse=True)
        
        return Response(analytics, status=status.HTTP_200_OK)
    except Shopkeeper.DoesNotExist:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

# Dashboard Stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def shopkeeper_dashboard(request):
    try:
        shopkeeper = Shopkeeper.objects.get(id=request.user.id)
        
        # Get stats
        total_products = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper).count()
        out_of_stock = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper, stock_quantity=0).count()
        low_stock = ShopkeeperProduct.objects.filter(shopkeeper=shopkeeper, stock_quantity__lte=10, stock_quantity__gt=0).count()
        total_orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper).count()
        pending_orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper, status='pending').count()
        total_revenue = sum(order.total_amount for order in ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper, status='delivered'))
        commission_rate = 0.15  # 15% platform commission
        total_commission = float(total_revenue) * commission_rate
        net_earnings = float(total_revenue) - total_commission
        
        # Recent orders
        recent_orders = ShopkeeperOrder.objects.filter(shopkeeper=shopkeeper).order_by('-created_at')[:5]
        recent_orders_serializer = ShopkeeperOrderSerializer(recent_orders, many=True)
        
        return Response({
            'stats': {
                'total_products': total_products,
                'out_of_stock': out_of_stock,
                'low_stock': low_stock,
                'total_orders': total_orders,
                'pending_orders': pending_orders,
                'total_revenue': float(total_revenue),
                'commission_rate': commission_rate,
                'total_commission': total_commission,
                'net_earnings': net_earnings
            },
            'recent_orders': recent_orders_serializer.data
        }, status=status.HTTP_200_OK)
    except Shopkeeper.DoesNotExist:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
