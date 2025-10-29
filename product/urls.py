from django.urls import path
from . import views

urlpatterns=[
        path('product/<int:id>/', views.ProductDetailView.as_view(), name='product-detail'),
        path('products/', views.product_view.as_view()),
        path('categories/',views.get_categories),
        path('products-by-category/', views.get_products_by_category),
        path('category/<slug:slug>/products/', views.get_products_by_category_slug),
        path('recently-viewed/', views.get_recently_viewed),
        path('similar-products/<int:id>/', views.get_similar_products),
        path('search/', views.search_products),
]