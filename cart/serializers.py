from rest_framework import serializers
from .models import Cart, CartItem
from product.models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Minimal product serializer for displaying product info in cart"""
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'primary_image']
    
    def get_primary_image(self, obj):
        primary_img = obj.images.filter(is_primary=True).first()
        if primary_img:
            return primary_img.image.url if hasattr(primary_img.image, 'url') else str(primary_img.image)
        elif obj.images.exists():
            return obj.images.first().image.url if hasattr(obj.images.first().image, 'url') else str(obj.images.first().image)
        return None


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for items inside a cart"""
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()


class CartSerializer(serializers.ModelSerializer):
    """Main Cart serializer"""
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['user', 'total_price', 'total_items']

    def get_total_price(self, obj):
        return obj.total_price()

    def get_total_items(self, obj):
        return obj.total_items()

    def create(self, validated_data):
        """Automatically link cart to current user"""
        user = self.context['request'].user
        cart = Cart.objects.create(user=user)
        return cart
