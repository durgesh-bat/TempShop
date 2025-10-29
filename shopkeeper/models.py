from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from product.models import Product

class Shopkeeper(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    alternate_phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = CloudinaryField("profile_picture", folder="shopkeepers", blank=True, null=True)
    business_name = models.CharField(max_length=200, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    longitude = models.FloatField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='shopkeeper_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='shopkeeper_set',
        blank=True
    )

    class Meta:
        db_table = 'shopkeeper_shopkeeper'

    def __str__(self):
        return self.username


class ShopkeeperProduct(models.Model):
    shopkeeper = models.ForeignKey(Shopkeeper, on_delete=models.CASCADE, related_name="products")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="shopkeeper_products")
    stock_quantity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('shopkeeper', 'product')

    def __str__(self):
        return f"{self.product.name} - {self.shopkeeper.username}"


class ShopkeeperOrder(models.Model):
    shopkeeper = models.ForeignKey(Shopkeeper, on_delete=models.CASCADE, related_name="orders")
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField(blank=True, null=True)
    customer_phone = models.CharField(max_length=15)
    customer_address = models.TextField()
    order_details = models.JSONField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.shopkeeper.username}"


class ShopkeeperDocument(models.Model):
    shopkeeper = models.ForeignKey(Shopkeeper, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=150)
    document_name = models.CharField(max_length=255)
    document_file = CloudinaryField('document', folder="documents")
    is_verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.document_name


class ShopkeeperReview(models.Model):
    shopkeeper = models.ForeignKey(Shopkeeper, on_delete=models.CASCADE, related_name="reviews")
    reviewer_name = models.CharField(max_length=100)
    reviewer_email = models.EmailField(blank=True, null=True)
    rating = models.PositiveIntegerField(default=5)
    review_text = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.shopkeeper.username}"
