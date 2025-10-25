from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Shopkeeper, ShopkeeperProduct, ShopkeeperOrder, ShopkeeperDocument, ShopkeeperReview

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']

class ShopkeeperRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    username = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)

    class Meta:
        model = Shopkeeper
        fields = ['username', 'email', 'password', 'password2', 'name', 'phone_number', 'address', 'business_name', 'business_type']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        # Create User account
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'password': validated_data['password']
        }
        user = User.objects.create_user(**user_data)
        
        # Create Shopkeeper profile
        shopkeeper_data = {
            'user': user,
            'name': validated_data['name'],
            'phone_number': validated_data.get('phone_number'),
            'address': validated_data.get('address'),
            'business_name': validated_data.get('business_name'),
            'business_type': validated_data.get('business_type'),
            'email': validated_data['email']
        }
        shopkeeper = Shopkeeper.objects.create(**shopkeeper_data)
        return shopkeeper

class ShopkeeperLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class ShopkeeperSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Shopkeeper
        fields = ['id', 'user', 'name', 'email', 'phone_number', 'alternate_phone_number', 
                 'address', 'profile_picture', 'longitude', 'latitude', 'is_active', 
                 'is_verified', 'business_name', 'business_type', 'created_at', 'updated_at']

class ShopkeeperProductSerializer(serializers.ModelSerializer):
    shopkeeper_name = serializers.CharField(source='shopkeeper.name', read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = ShopkeeperProduct
        fields = ['id', 'shopkeeper', 'shopkeeper_name', 'product','stock_quantity']

class ShopkeeperOrderSerializer(serializers.ModelSerializer):
    shopkeeper_name = serializers.CharField(source='shopkeeper.name', read_only=True)

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
