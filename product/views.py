from rest_framework.decorators import api_view
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from account.models import RecentlyViewed
from django.db import models


class ProductDetailView(APIView):
    def get(self, request, id, format=None):
        """Return a single product by ID"""
        from shopkeeper.models import ShopkeeperProduct
        from django.db.models import Sum
        
        product = get_object_or_404(Product, id=id)
        
        # Check total stock across all shopkeepers
        total_stock = ShopkeeperProduct.objects.filter(
            product=product
        ).aggregate(total=Sum('stock_quantity'))['total'] or 0
        
        # Update product availability based on stock
        if total_stock == 0 and product.is_available:
            product.is_available = False
            product.save()
        elif total_stock > 0 and not product.is_available:
            product.is_available = True
            product.save()
        
        # Track recently viewed for authenticated users
        if request.user.is_authenticated:
            RecentlyViewed.objects.update_or_create(
                user=request.user,
                product=product
            )
        
        serializer = ProductSerializer(product)
        data = serializer.data
        data['total_stock'] = total_stock
        return Response(data)

class product_view(APIView):
    def get(self, request, format=None):
        products = Product.objects.all()
        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data)
    def post(self,request, format=None):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_products_by_category(request):
    """Get products grouped by category"""
    categories = Category.objects.prefetch_related('products__images').all()
    result = []
    for category in categories:
        products = category.products.filter(is_available=True)[:8]
        if products.exists():
            result.append({
                'category': CategorySerializer(category).data,
                'products': ProductSerializer(products, many=True).data
            })
    return Response(result)

@api_view(['GET', 'POST'])
def get_recently_viewed(request):
    """Get user's recently viewed products or add a product to recently viewed"""
    if not request.user.is_authenticated:
        return Response([])
    
    if request.method == 'POST':
        product_id = request.data.get('product_id')
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
                RecentlyViewed.objects.update_or_create(
                    user=request.user,
                    product=product
                )
                return Response({'success': True})
            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=404)
        return Response({'error': 'Product ID required'}, status=400)
    
    recent = RecentlyViewed.objects.filter(user=request.user).select_related('product')[:8]
    products = [rv.product for rv in recent if rv.product.is_available]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_similar_products(request, id):
    """Get similar products based on category"""
    product = get_object_or_404(Product, id=id)
    similar = Product.objects.filter(
        category=product.category,
        is_available=True
    ).exclude(id=id).prefetch_related('images')[:8]
    serializer = ProductSerializer(similar, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_products(request):
    """Search products by name, description, or category"""
    query = request.GET.get('q', '').strip()
    if not query:
        return Response([])
    
    products = Product.objects.filter(
        models.Q(name__icontains=query) |
        models.Q(description__icontains=query) |
        models.Q(category__name__icontains=query),
        is_available=True
    ).prefetch_related('images').distinct()[:50]
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_products_by_category_slug(request, slug):
    """Get all products for a specific category by slug"""
    category = get_object_or_404(Category, slug=slug)
    products = Product.objects.filter(
        category=category,
        is_available=True
    ).prefetch_related('images')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)