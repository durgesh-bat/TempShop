import requests
from django.core.management.base import BaseCommand
from product.models import Product, Category, ProductImage
from django.utils.text import slugify
import cloudinary.uploader
from dotenv import load_dotenv
import os
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('API_KEY'),
    api_secret=os.getenv('API_SECRET'),
    secure=True
)

def upload_to_cloudinary(image_url, folder, public_id):
    """Upload image to Cloudinary and return public_id"""
    try:
        result = cloudinary.uploader.upload(
            image_url,
            folder=folder,
            public_id=public_id,
            overwrite=True,
            transformation={
                'quality': 'auto:good',
                'fetch_format': 'auto',
                'crop': 'limit',
                'width': 1000,
                'height': 1000
            }
        )
        return result['public_id']
    except Exception as e:
        print(f"❌ Failed to upload image: {e}")
        return None

def seed_categories():
    """Fetch and save categories from dummyjson"""
    try:
        response = requests.get('https://dummyjson.com/products/categories')
        response.raise_for_status()
        categories = response.json()
        
        for cat in categories:
            cat_slug = cat.get('slug') or slugify(cat.get('name', 'others'))
            if not Category.objects.filter(slug=cat_slug).exists():
                Category.objects.create(
                    name=cat.get('name', 'Others'),
                    slug=cat_slug
                )
                print(f"✅ Created category: {cat.get('name')}")
    except Exception as e:
        print(f"❌ Error fetching categories: {e}")

def seed_products():
    """Fetch products from dummyjson API"""
    try:
        response = requests.get('https://dummyjson.com/products?limit=100')
        response.raise_for_status()
        data = response.json()
        products = data.get('products', [])
        
        for prod in products:
            try:
                # Skip if no images
                if not prod.get('images') or len(prod['images']) == 0:
                    print(f"⚠️ Skipping {prod.get('title')} - no images")
                    continue
                
                slug = slugify(prod['title'])
                if Product.objects.filter(slug=slug).exists():
                    continue
                
                # Get or create category
                cat_slug = slugify(prod.get('category', 'others'))
                category, _ = Category.objects.get_or_create(
                    slug=cat_slug,
                    defaults={'name': prod.get('category', 'Others').title()}
                )
                
                # Create product
                product = Product.objects.create(
                    name=prod['title'],
                    slug=slug,
                    price=prod['price'] * 83.0,
                    description=prod.get('description', ''),
                    category=category
                )
                
                # Create product images
                for i, img_url in enumerate(prod['images']):
                    cloudinary_id = upload_to_cloudinary(
                        img_url,
                        'products',
                        f"product_{slug}_img_{i}"
                    )
                    if cloudinary_id:
                        ProductImage.objects.create(
                            product=product,
                            image=cloudinary_id,
                            is_primary=(i == 0),
                            order=i
                        )
                
                print(f"✅ Created: {product.name}")
            except Exception as e:
                print(f"❌ Error creating {prod.get('title', 'product')}: {e}")
    except Exception as e:
        print(f"❌ Error fetching products: {e}")

class Command(BaseCommand):
    help = 'Seed database with products'
    
    def handle(self, *args, **kwargs):
        self.stdout.write('🔄 Seeding categories...')
        seed_categories()
        self.stdout.write('🔄 Seeding products...')
        seed_products()
        self.stdout.write(self.style.SUCCESS('🎉 Database seeded successfully'))
