from rest_framework import serializers
from .models import Client, Address, Wallet, PaymentMethod, Order, OrderItem, Review, Wishlist, Notification, ProductQuestion
from product.serializers import ProductSerializer
from .validators import validate_email, validate_username, validate_phone, validate_text_input

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, min_length=8, max_length=128)
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Client
        fields = ('username', 'email', 'password', 'password2', 'phone_number')

    def validate_username(self, value):
        return validate_username(value)
    
    def validate_email(self, value):
        return validate_email(value)
    
    def validate_phone_number(self, value):
        if value:
            return validate_phone(value)
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Check password strength
        password = data['password']
        if not any(c.isupper() for c in password):
            raise serializers.ValidationError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in password):
            raise serializers.ValidationError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in password):
            raise serializers.ValidationError("Password must contain at least one digit")
        
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = Client.objects.create_user(**validated_data)
        return user


class ClientSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Client
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'profile_picture', 'date_joined', 'is_email_verified']
        read_only_fields = ['id', 'date_joined', 'is_email_verified']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'label', 'street', 'city', 'state', 'postal_code', 'country', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_label(self, value):
        return validate_text_input(value, 'Label', 50)
    
    def validate_street(self, value):
        return validate_text_input(value, 'Street', 255)
    
    def validate_city(self, value):
        return validate_text_input(value, 'City', 100)
    
    def validate_state(self, value):
        return validate_text_input(value, 'State', 100)
    
    def validate_country(self, value):
        return validate_text_input(value, 'Country', 100)


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'balance', 'created_at']
        read_only_fields = ['id', 'created_at']


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'card_type', 'last_four', 'expiry_month', 'expiry_year', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    shopkeeper_name = serializers.CharField(source='shopkeeper.business_name', read_only=True, allow_null=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'shopkeeper_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'address', 'total', 'status', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReviewSerializer(serializers.ModelSerializer):
    user = ClientSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def validate_rating(self, value):
        if not isinstance(value, int) or value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_comment(self, value):
        if value:
            return validate_text_input(value, 'Comment', 1000)
        return value


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'added_at']
        read_only_fields = ['id', 'added_at']


class ProductQuestionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    answered_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ProductQuestion
        fields = ['id', 'user', 'question', 'answer', 'answered_by', 'created_at', 'answered_at']
        read_only_fields = ['id', 'user', 'answered_by', 'created_at', 'answered_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']
