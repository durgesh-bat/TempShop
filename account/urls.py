from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", views.refresh_token, name="token_refresh"),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    path("register/", views.register_user, name="register"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
    path("csrf/", views.get_csrf_token, name="csrf"),
    path('profile/', views.ProfileView.as_view(), name='user-profile'),

    path('addresses/', views.AddressView.as_view(), name='addresses'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address-detail'),

    path('wallet/', views.WalletView.as_view(), name='wallet'),

    path('payment-methods/', views.PaymentMethodView.as_view(), name='payment-methods'),
    path('payment-methods/<int:pk>/', views.PaymentMethodDetailView.as_view(), name='payment-method-detail'),

    path('orders/', views.OrderView.as_view(), name='orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:order_id>/receipt/', views.download_purchase_receipt, name='download-purchase-receipt'),

    path('reviews/', views.ReviewView.as_view(), name='reviews'),
    path('reviews/<int:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),

    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:pk>/', views.WishlistDetailView.as_view(), name='wishlist-detail'),
    path('wishlist/product-ids/', views.wishlist_product_ids, name='wishlist-product-ids'),
    path('wishlist/product/<int:product_id>/', views.remove_from_wishlist_by_product, name='remove-from-wishlist-by-product'),

    path('products/<int:product_id>/reviews/', views.product_reviews, name='product-reviews'),
    
    path('verify-email/<str:token>/', views.verify_email, name='verify-email'),
    path('send-otp/', views.send_otp, name='send-otp'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
]