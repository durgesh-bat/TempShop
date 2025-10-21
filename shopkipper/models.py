from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
import uuid

# Create your models here.
def upload_to(instance, filename):
    return f'shopkeepers/{instance.id}/{filename}'

class Shopkeeper(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shopkeeper_profile')
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    alternate_phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = CloudinaryField(
        'image', 
        blank=True, 
        null=True,
        folder='shopkeepers',
        transformation={
            'quality': 'auto:good',
            'fetch_format': 'auto',
            'crop': 'limit',
            'width': 500,
            'height': 500
        },
        format='jpg'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    business_name = models.CharField(max_length=200, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class ShopkeeperProduct(models.Model):
    id = models.AutoField(primary_key=True)
    shopkeeper = models.ForeignKey(Shopkeeper, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    image = CloudinaryField(
        'image',
        folder='shopkeeper_products',
        transformation={
            'quality': 'auto:good',
            'fetch_format': 'auto',
            'crop': 'limit',
            'width': 800,
            'height': 800
        },
        format='jpg'
    )
    category = models.CharField(max_length=100, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} - {self.shopkeeper.name}'

class ShopkeeperOrder(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.AutoField(primary_key=True)
    shopkeeper = models.ForeignKey(Shopkeeper, related_name='orders', on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15)
    customer_address = models.TextField()
    
    order_details = models.JSONField()  # Store order items as JSON
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Order {self.id} - {self.shopkeeper.name}'
    
class ShopkeeperDocument(models.Model):
    DOCUMENT_TYPES = [
        ('business_license', 'Business License'),
        ('tax_certificate', 'Tax Certificate'),
        ('identity_proof', 'Identity Proof'),
        ('address_proof', 'Address Proof'),
        ('other', 'Other'),
    ]
    
    shopkeeper = models.ForeignKey(Shopkeeper, related_name='documents', on_delete=models.CASCADE)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    document_name = models.CharField(max_length=100)
    document_file = CloudinaryField('document')
    is_verified = models.BooleanField(default=False)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.document_name} - {self.shopkeeper.name}'

class ShopkeeperReview(models.Model):
    shopkeeper = models.ForeignKey(Shopkeeper, related_name='reviews', on_delete=models.CASCADE)
    reviewer_name = models.CharField(max_length=100)
    reviewer_email = models.EmailField()
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    review_text = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review by {self.reviewer_name} for {self.shopkeeper.name}'
