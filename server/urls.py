from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('product.urls')),
    path('api/auth/',include('account.urls')),
    path('api/',include('cart.urls')),
    path('api/shopkeeper/', include('shopkipper.urls')),
]
