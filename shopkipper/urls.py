from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.shopkeeper_register, name='shopkeeper-register'),
    path('login/', views.shopkeeper_login, name='shopkeeper-login'),
    
    # Profile Management
    path('profile/', views.ShopkeeperProfileView.as_view(), name='shopkeeper-profile'),
    
    # Product Management
    path('products/', views.ShopkeeperProductView.as_view(), name='shopkeeper-products'),
    path('products/<uuid:product_id>/', views.ShopkeeperProductDetailView.as_view(), name='shopkeeper-product-detail'),
    
    # Order Management
    path('orders/', views.ShopkeeperOrderView.as_view(), name='shopkeeper-orders'),
    path('orders/<uuid:order_id>/', views.ShopkeeperOrderDetailView.as_view(), name='shopkeeper-order-detail'),
    
    # Document Management
    path('documents/', views.ShopkeeperDocumentView.as_view(), name='shopkeeper-documents'),
    
    # Reviews Management
    path('reviews/', views.ShopkeeperReviewView.as_view(), name='shopkeeper-reviews'),
    
    # Dashboard
    path('dashboard/', views.shopkeeper_dashboard, name='shopkeeper-dashboard'),
]
