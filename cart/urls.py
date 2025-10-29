from django.urls import path
from . import views
urlpatterns = [
    path('cart/', views.CartView.as_view()),  # GET all cart items
    path('cart/<int:product_id>/', views.CartView.as_view()),  # POST/DELETE item
]