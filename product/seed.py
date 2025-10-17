import os
import django
import uuid
import requests
from random import choice, randint
from urllib.parse import quote
import cloudinary
import cloudinary.uploader
import cloudinary.api


cloudinary.config(
    cloud_name = 'dq7zkxtnj',
    api_key = '293625196447388',
    api_secret = '-ZLaExlG3npgFUKSKmUunGWnN_M'
)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

# Import models using absolute import
from product.models import Category, SubCategory, Product  # <- change 'product' to your app name

# Pixabay API key
PEXELS_API_KEY = 'gBSbZFGGJALBm4BEh1rIxZyVm0lYgpr8KcOK3jEflKiiZk1SMWJGfZUx'
PEXELS_URL = 'https://api.pexels.com/v1/search'

# Categories and SubCategories
CATEGORIES = {
    "Electronics": ["Mobiles", "Laptops", "Cameras", "Headphones"],
    "Fashion": ["Men's Clothing", "Women's Clothing", "Footwear", "Watches"],
    "Home & Kitchen": ["Furniture", "Decor", "Appliances", "Lighting"],
}

def get_image_url(category_name, subcategory_name):
    query = f"{category_name} {subcategory_name}"
    headers = {'Authorization': PEXELS_API_KEY}
    params = {'query': query, 'per_page': 1}

    try:
        response = requests.get(PEXELS_URL, headers=headers, params=params, timeout=5)
        if response.status_code != 200:
            print(f"Pexels API error: Status code {response.status_code}")
            return "https://via.placeholder.com/300"

        data = response.json()
        if 'photos' in data and data['photos']:
            return data['photos'][0]['src']['medium']
    except Exception as e:
        print("Pexels request exception:", e)

    return "https://via.placeholder.com/300"


# Seed Categories and SubCategories
category_objs, subcat_objs = {}, {}
for cat_name, subcats in CATEGORIES.items():
    cat, _ = Category.objects.get_or_create(name=cat_name)
    category_objs[cat_name] = cat
    for sub in subcats:
        subcat, _ = SubCategory.objects.get_or_create(category=cat, name=sub)
        subcat_objs[f"{cat_name}-{sub}"] = subcat

# Product base names
PRODUCT_NAMES = [
    "Samsung Galaxy S24", "iPhone 15", "OPPO K13x", "OnePlus 12",
    "Dell XPS 13", "MacBook Pro 16", "HP Spectre x360", "Sony WH-1000XM5",
    "Bose QuietComfort 45", "Canon EOS R6", "GoPro Hero 12", "Apple Watch Series 9",
    "Samsung Galaxy Watch 6", "Sony Bravia 65 inch", "LG OLED 55 inch",
    "Nike Air Max", "Adidas Ultraboost", "Puma Running Shoes", "Levi's 501 Jeans",
    "Zara Leather Jacket", "H&M Hoodie", "Gucci Handbag", "Louis Vuitton Wallet",
    "Fossil Watch", "Casio G-Shock", "Ray-Ban Aviator Sunglasses", "Nike Sports T-Shirt",
    "IKEA Chair", "KitchenAid Mixer", "Dyson V15 Vacuum", "Philips Air Fryer",
    "Samsung Refrigerator", "LG Washing Machine", "Sony Home Theater",
    "Nest Smart Thermostat", "Dyson Fan", "Instant Pot Duo", "Havells Mixer Grinder",
    "Harry Potter Book Set", "The Hobbit", "The Alchemist", "Sherlock Holmes Collection",
    "Nike Football", "Adidas Soccer Ball", "Yonex Badminton Racket", "Decathlon Tent"
]

# Create 50 products
for _ in range(20):
    name = choice(PRODUCT_NAMES)
    category_name = choice(list(CATEGORIES.keys()))
    subcategory_name = choice(CATEGORIES[category_name])
    category = category_objs[category_name]
    subcategory = subcat_objs[f"{category_name}-{subcategory_name}"]
    price = round(randint(500, 50000), 2)
    description = f"Dummy description for {name} in {subcategory_name}."

    image_url = get_image_url(category_name, subcategory_name)

    result = cloudinary.uploader.upload(image_url, folder=f"products/{uuid.uuid4()}")
    product = Product.objects.create(
        name=name,
        category=category,
        subcategory=subcategory,
        price=price,
        description=description,
        image=result['secure_url']  # Cloudinary URL
    )
    print(f"Created product: {product.name}")

print("✅ Seeding completed!")
