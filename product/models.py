from django.db import models
from cloudinary.models import CloudinaryField

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    image = CloudinaryField(
        'image',
        folder='categories',
        transformation={
            'quality': 'auto:good',
            'fetch_format': 'auto',
            'crop': 'limit',
            'width': 1000,
            'height': 1000
        },
        format='jpg',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    rating = models.FloatField(default=0.0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_available_shopkeepers(self):
        from shopkeeper.models import ShopkeeperProduct
        return ShopkeeperProduct.objects.filter(product=self, stock_quantity__gt=0).select_related('shopkeeper')

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField(
        'image',
        folder='products',
        transformation={
            'quality': 'auto:good',
            'fetch_format': 'auto',
            'crop': 'limit',
            'width': 1000,
            'height': 1000
        },
        format='jpg'
    )
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
        
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"
