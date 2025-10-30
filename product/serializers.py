from rest_framework import serializers
from .models import Product, Category, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']
    
    def get_image(self, obj):
        if obj.image:
            return obj.image.url if hasattr(obj.image, 'url') else str(obj.image)
        return None

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    images = ProductImageSerializer(many=True, read_only=True)
    total_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
    
    def get_total_stock(self, obj):
        from shopkeeper.models import ShopkeeperProduct
        from django.db.models import Sum
        return ShopkeeperProduct.objects.filter(product=obj).aggregate(total=Sum('stock_quantity'))['total'] or 0

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']
    
    def get_image(self, obj):
        if obj.image:
            return obj.image.url if hasattr(obj.image, 'url') else str(obj.image)
        return None

