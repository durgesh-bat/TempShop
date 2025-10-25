from django.db import models
import uuid
import cloudinary
import cloudinary.uploader
from cloudinary.models import CloudinaryField

def product_image_upload_path(instance, filename):
    return f"products/{instance.id}/{filename}"


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='subcategories'
    )
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('category', 'name')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.category.name})"



class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
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
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    rating = models.FloatField(default=0.0)
    is_available = models.BooleanField(default=True)
    def __str__(self):
        return self.name
