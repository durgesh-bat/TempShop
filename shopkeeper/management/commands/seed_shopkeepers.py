from django.core.management.base import BaseCommand
from shopkeeper.models import Shopkeeper, ShopkeeperProduct
from product.models import Product
import random

class Command(BaseCommand):
    help = 'Create 10 shopkeepers and assign products'

    def handle(self, *args, **kwargs):
        shopkeepers_data = [
            {'username': 'shop_electronics', 'email': 'electronics@shop.com', 'business_name': 'Tech Hub', 'business_type': 'Electronics'},
            {'username': 'shop_fashion', 'email': 'fashion@shop.com', 'business_name': 'Style Store', 'business_type': 'Fashion'},
            {'username': 'shop_home', 'email': 'home@shop.com', 'business_name': 'Home Essentials', 'business_type': 'Home & Garden'},
            {'username': 'shop_sports', 'email': 'sports@shop.com', 'business_name': 'Sports Arena', 'business_type': 'Sports'},
            {'username': 'shop_books', 'email': 'books@shop.com', 'business_name': 'Book Haven', 'business_type': 'Books'},
            {'username': 'shop_toys', 'email': 'toys@shop.com', 'business_name': 'Toy World', 'business_type': 'Toys'},
            {'username': 'shop_beauty', 'email': 'beauty@shop.com', 'business_name': 'Beauty Palace', 'business_type': 'Beauty'},
            {'username': 'shop_grocery', 'email': 'grocery@shop.com', 'business_name': 'Fresh Mart', 'business_type': 'Grocery'},
            {'username': 'shop_furniture', 'email': 'furniture@shop.com', 'business_name': 'Furniture Plus', 'business_type': 'Furniture'},
            {'username': 'shop_jewelry', 'email': 'jewelry@shop.com', 'business_name': 'Gem Gallery', 'business_type': 'Jewelry'},
        ]

        products = list(Product.objects.all())
        if not products:
            self.stdout.write(self.style.ERROR('No products found. Run seed command first.'))
            return

        for data in shopkeepers_data:
            shopkeeper, created = Shopkeeper.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': data['email'],
                    'business_name': data['business_name'],
                    'business_type': data['business_type'],
                    'is_verified': True,
                    'is_staff': True,
                    'is_superuser': False,
                }
            )
            
            if created:
                shopkeeper.set_password('shopkeeper123')
                shopkeeper.save()
                
                # Assign 5-15 random products
                num_products = random.randint(5, 15)
                assigned_products = random.sample(products, min(num_products, len(products)))
                
                for product in assigned_products:
                    ShopkeeperProduct.objects.get_or_create(
                        shopkeeper=shopkeeper,
                        product=product,
                        defaults={'stock_quantity': random.randint(10, 100)}
                    )
                
                self.stdout.write(self.style.SUCCESS(f'Created {shopkeeper.username} with {num_products} products'))
            else:
                if not shopkeeper.is_staff:
                    shopkeeper.is_staff = True
                    shopkeeper.save()
                    self.stdout.write(self.style.SUCCESS(f'Updated {shopkeeper.username} to is_staff=True'))
                else:
                    self.stdout.write(self.style.WARNING(f'{shopkeeper.username} already exists'))

        self.stdout.write(self.style.SUCCESS('Shopkeeper seeding completed!'))
