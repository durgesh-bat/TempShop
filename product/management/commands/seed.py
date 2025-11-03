import requests
from django.core.management.base import BaseCommand
from product.models import Product, Category, ProductImage
from django.utils.text import slugify
import cloudinary.uploader
from dotenv import load_dotenv
import os
import random
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
            cat_slug = cat.get('slug') or slugify(cat.get('name', cat))
            cat_name = cat.get('name', cat) if isinstance(cat, dict) else cat
            
            if not Category.objects.filter(slug=cat_slug).exists():
                Category.objects.create(
                    name=cat_name.title(),
                    slug=cat_slug
                )
                print(f"✅ Created category: {cat_name}")
    except Exception as e:
        print(f"❌ Error fetching categories: {e}")

def seed_products(start=1, end=100):
    """Fetch products from dummyjson API"""
    for product_id in range(start, end + 1):
        try:
            response = requests.get(f'https://dummyjson.com/products/{product_id}')
            
            if response.status_code == 404:
                print(f"⚠️ Product {product_id} not found, skipping...")
                continue
            
            response.raise_for_status()
            prod = response.json()
            
            if 'message' in prod:
                print(f"⚠️ Product {product_id} not found, skipping...")
                continue
            
            if not prod.get('images') or len(prod['images']) == 0:
                print(f"⚠️ Skipping {prod.get('title')} - no images")
                continue
            
            slug = slugify(prod['title'])
            if Product.objects.filter(slug=slug).exists():
                continue
            
            # Get or create category
            cat_name = prod.get('category', 'Others')
            cat_slug = slugify(cat_name)
            category, _ = Category.objects.get_or_create(
                slug=cat_slug,
                defaults={'name': cat_name.title()}
            )
            
            # Create product
            product = Product.objects.create(
                name=prod['title'],
                slug=slug,
                price=prod.get('price', 0) * 83,
                description=prod.get('description', ''),
                category=category,
                rating=prod.get('rating', round(random.uniform(3.5, 5.0), 1)),
                is_available=prod.get('stock', 0) > 0
            )
            
            # Upload product images
            for i, img_url in enumerate(prod['images']):
                if img_url:
                    cloudinary_id = upload_to_cloudinary(img_url, 'products', f'product_{slug}_img_{i}')
                    if cloudinary_id:
                        ProductImage.objects.create(
                            product=product,
                            image=cloudinary_id,
                            is_primary=(i == 0),
                            order=i
                        )
            
            print(f"✅ Created: {product.name} (Rating: {product.rating})")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Network error for product {product_id}: {e}")
            continue
        except Exception as e:
            print(f"❌ Error creating product {product_id}: {e}")
            continue


class Command(BaseCommand):
    help = 'Seed database with products'
    
    def add_arguments(self, parser):
        parser.add_argument('--start', type=int, default=1, help='Start product ID')
        parser.add_argument('--end', type=int, default=100, help='End product ID')
    
    def handle(self, *args, **kwargs):
        start = kwargs['start']
        end = kwargs['end']
        self.stdout.write('🔄 Seeding categories...')
        seed_categories()
        self.stdout.write(f'🔄 Seeding products {start} to {end}...')
        seed_products(start, end)
        self.stdout.write(self.style.SUCCESS('🎉 Database seeded successfully'))
