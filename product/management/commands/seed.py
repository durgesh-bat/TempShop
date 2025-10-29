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
    """Fetch and save categories with images"""
    try:
        response = requests.get('https://api.escuelajs.co/api/v1/categories')
        response.raise_for_status()
        categories = response.json()
        
        for cat in categories:
            cat_slug = cat.get('slug') or slugify(cat.get('name', 'others'))
            category = Category.objects.filter(slug=cat_slug).first()
            
            if category:
                # Update only image
                if cat.get('image'):
                    cloudinary_id = upload_to_cloudinary(
                        cat['image'],
                        'categories',
                        f"category_{cat_slug}"
                    )
                    if cloudinary_id:
                        category.image = cloudinary_id
                        category.save()
                        print(f"✅ Updated category image: {category.name}")
            else:
                # Create new category
                cat_image = None
                if cat.get('image'):
                    cat_image = upload_to_cloudinary(
                        cat['image'],
                        'categories',
                        f"category_{cat_slug}"
                    )
                category = Category.objects.create(
                    name=cat.get('name', 'Others'),
                    slug=cat_slug,
                    image=cat_image
                )
                print(f"✅ Created category: {category.name}")
    except Exception as e:
        print(f"❌ Error fetching categories: {e}")

def seed_products():
    """Fetch products from API"""
    try:
        response = requests.get('https://api.escuelajs.co/api/v1/products/')
        response.raise_for_status()
        products = response.json()
        
        for prod in products:
            try:
                # Skip if no images
                if not prod.get('images') or len(prod['images']) == 0:
                    continue
                
                slug = prod.get('slug') or slugify(prod['title'])
                if Product.objects.filter(slug=slug).exists():
                    continue
                
                # Get category by slug
                cat_data = prod.get('category', {})
                cat_slug = cat_data.get('slug') or slugify(cat_data.get('name', 'others'))
                category = Category.objects.filter(slug=cat_slug).first()
                
                if not category:
                    continue
                
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
                print(f"❌ Error: {e}")
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
