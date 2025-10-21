import requests
from django.core.management.base import BaseCommand
from product.models import Product, Category
import cloudinary
import cloudinary.uploader

# ✅ Configure Cloudinary here
cloudinary.config(
    cloud_name="dq7zkxtnj",  # replace with your Cloudinary cloud name
    api_key="293625196447388",  # replace with your API key
    api_secret="-ZLaExlG3npgFUKSKmUunGWnN_M",  # replace with your API secret
    secure=True
)


def fetch_products_from_api(start, end):
    """
    Fetch products from start to end index (inclusive)
    Example: fetch_products_from_api(1, 5) will fetch products with IDs 1,2,3,4,5
    """
    try:
        for product_id in range(start, end + 1):
            # Fetch single product
            response = requests.get(f'https://dummyjson.com/products/{product_id}')
            response.raise_for_status()
            data = response.json()
            
            print(f"\nFetched Product {product_id}:")
            print(data)  # Print the raw product data
            
            try:
                # Upload image to Cloudinary
                image_url = data.get('image')
                uploaded_image_url = None

                if image_url:
                    try:
                        # Add unique filename to prevent duplicates
                        upload_result = cloudinary.uploader.upload(
                            image_url,
                            folder="products",
                            public_id=f"product_{data['id']}",
                            overwrite=True
                        )
                        uploaded_image_url = upload_result["public_id"]
                    except Exception as e:
                        print(f"❌ Failed to upload image for {data['title']}: {e}")

                # Create or get category
                category_name = data.get('category', 'Uncategorized')
                category, _ = Category.objects.get_or_create(name=category_name)

                # Get rating data
                rating_data = data.get('rating', {})
                rating = rating_data.get('rate', 0)
                stock = rating_data.get('count', 0)

                # Create or update product
                product, created = Product.objects.update_or_create(
                    name=data['title'],
                    defaults={
                        'price': data.get('price', 0),
                        'description': data.get('description', ''),
                        'category': category,
                        'subcategory': None,
                        'image': uploaded_image_url or data.get('image', ''),
                        'rating': rating,
                        'stock': stock,
                        'latitude': data.get('latitude', 0.0),
                        'longitude': data.get('longitude', 0.0)
                    }
                )

                if created:
                    print(f"✅ Created product: {product.name}")
                    print(f"   Image: {product.image or 'No Image'}")
                    print(f"   Rating: {rating}, Stock: {stock}")
                else:
                    print(f"📝 Updated product: {product.name}")

            except Exception as e:
                print(f"❌ Error processing product {data.get('title', 'Unknown')}: {e}")

    except requests.RequestException as e:
        print(f"❌ Error fetching products from API: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


class Command(BaseCommand):
    help = 'Seed the database with products from an external API'

    def add_arguments(self, parser):
        parser.add_argument('--start', type=int, default=1, help='Starting product ID')
        parser.add_argument('--end', type=int, default=5, help='Ending product ID')

    def handle(self, *args, **kwargs):
        start = kwargs['start']
        end = kwargs['end']
        self.stdout.write(f'🔄 Fetching products from ID {start} to {end}...')
        fetch_products_from_api(start, end)
        self.stdout.write(self.style.SUCCESS('🎉 Successfully seeded the database with products'))
