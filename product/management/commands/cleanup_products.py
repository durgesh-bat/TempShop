from django.core.management.base import BaseCommand
from product.models import Product, ProductImage


class Command(BaseCommand):
    help = 'Delete products that have no images or only images with order 0'

    def handle(self, *args, **kwargs):
        deleted_count = 0
        
        for product in Product.objects.all():
            images = product.images.all()
            
            # Check if product has no images or all images have order 0
            if not images.exists() or all(img.order == 0 for img in images):
                product_name = product.name
                product.delete()  # Cascade deletes images
                deleted_count += 1
                self.stdout.write(f'Deleted: {product_name}- {product.id}')
        
        self.stdout.write(self.style.SUCCESS(f'Total products deleted: {deleted_count}'))
