from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

# Create your models here.

def upload_to(instance, filename):
    return f"profile_pictures/{instance.user.username}/{filename}"

class UserAccount(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)
    profile_picture = CloudinaryField(
        'image',
        folder='profiles',
        transformation={
            'quality': 'auto:good',
            'fetch_format': 'auto',
            'crop': 'limit',
            'width': 1000,
            'height': 1000
        },
        format='jpg'
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.phone_number}"
