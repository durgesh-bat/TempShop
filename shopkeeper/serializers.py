from rest_framework import serializers
from .models import Shopkeeper, ShopkeeperProduct, ShopkeeperOrder, ShopkeeperDocument, ShopkeeperReview

class ShopkeeperRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Shopkeeper
        fields = ['username', 'email', 'password', 'password2', 'phone_number', 'address', 'business_name', 'business_type']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        shopkeeper = Shopkeeper.objects.create_user(
            password=password,
            is_staff=True,
            **validated_data
        )
        return shopkeeper

class ShopkeeperLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class ShopkeeperSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Shopkeeper
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'alternate_phone_number', 
                 'address', 'profile_picture', 'longitude', 'latitude', 'is_active', 'is_staff',
                 'is_verified', 'business_name', 'business_type', 'date_joined']

class ShopkeeperProductSerializer(serializers.ModelSerializer):
    shopkeeper_name = serializers.CharField(source='shopkeeper.username', read_only=True)
    name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    description = serializers.CharField(source='product.description', read_only=True)
    category = serializers.CharField(source='product.category.name', read_only=True, allow_null=True)
    image = serializers.SerializerMethodField()
    is_available = serializers.BooleanField(source='product.is_available', read_only=True)

    class Meta:
        model = ShopkeeperProduct
        fields = ['id', 'shopkeeper', 'shopkeeper_name', 'product', 'name', 'price', 'description', 'category', 'stock_quantity', 'image', 'is_available']
        read_only_fields = ['shopkeeper']
    
    def get_image(self, obj):
        first_image = obj.product.images.first()
        if first_image and first_image.image:
            return first_image.image.url
        return None

class ShopkeeperOrderSerializer(serializers.ModelSerializer):
    shopkeeper_name = serializers.CharField(source='shopkeeper.username', read_only=True)

    class Meta:
        model = ShopkeeperOrder
        fields = ['id', 'shopkeeper', 'shopkeeper_name', 'customer_name', 'customer_email', 
                 'customer_phone', 'customer_address', 'order_details', 'total_amount', 
                 'status', 'created_at', 'updated_at']

class ShopkeeperDocumentSerializer(serializers.ModelSerializer):
    document_file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = ShopkeeperDocument
        fields = ['id', 'shopkeeper', 'document_type', 'document_name', 'document_file', 
                 'is_verified', 'uploaded_at']

class ShopkeeperReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopkeeperReview
        fields = ['id', 'shopkeeper', 'reviewer_name', 'reviewer_email', 'rating', 
                 'review_text', 'is_verified', 'created_at']
