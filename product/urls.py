from django.urls import path
from . import views

urlpatterns=[
        path('product/<uuid:id>/', views.ProductDetailView.as_view(), name='product-detail'),
        path('products/', views.product_view.as_view()),
        path('categories/',views.get_categories),
]