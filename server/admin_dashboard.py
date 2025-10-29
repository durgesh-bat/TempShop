from django.contrib import admin
from django.db.models import Count, Sum, Avg
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from product.models import Product, Category
from cart.models import Order, Cart
from account.models import UserAccount
from shopkipper.models import Shopkeeper
from django.contrib.auth.models import User


@staff_member_required
def admin_dashboard(request):
    """Custom admin dashboard with analytics"""
    
    # Basic stats
    total_users = User.objects.count()
    total_shopkeepers = Shopkeeper.objects.count()
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    
    # Revenue stats
    total_revenue = Order.objects.aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    # Recent orders
    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:10]
    
    # Top categories
    top_categories = Category.objects.annotate(
        product_count=Count('product')
    ).order_by('-product_count')[:5]
    
    # Order status distribution
    order_status = Order.objects.values('status').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Shopkeeper stats
    active_shopkeepers = Shopkeeper.objects.filter(is_active=True).count()
    verified_shopkeepers = Shopkeeper.objects.filter(is_verified=True).count()
    
    context = {
        'title': 'Admin Dashboard',
        'total_users': total_users,
        'total_shopkeepers': total_shopkeepers,
        'total_products': total_products,
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'recent_orders': recent_orders,
        'top_categories': top_categories,
        'order_status': order_status,
        'active_shopkeepers': active_shopkeepers,
        'verified_shopkeepers': verified_shopkeepers,
    }
    
    return render(request, 'admin/dashboard.html', context)


class CustomAdminSite(admin.AdminSite):
    """Custom admin site with dashboard"""
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', admin_dashboard, name='admin_dashboard'),
        ]
        return custom_urls + urls
    
    def index(self, request, extra_context=None):
        """Override admin index to include dashboard link"""
        extra_context = extra_context or {}
        extra_context['dashboard_url'] = self._build_absolute_uri(request, 'admin/dashboard/')
        return super().index(request, extra_context)


# Use custom admin site
admin_site = CustomAdminSite(name='custom_admin')

# Register all models with custom admin site
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin

admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
