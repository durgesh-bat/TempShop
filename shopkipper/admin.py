from django.contrib import admin
from .models import Shopkeeper, ShopkeeperProduct, ShopkeeperOrder, ShopkeeperDocument, ShopkeeperReview

# Register your models here.

@admin.register(Shopkeeper)
class ShopkeeperAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'business_name', 'is_active', 'is_verified', 'created_at')
    search_fields = ('name', 'email', 'phone_number', 'business_name')
    list_filter = ('is_active', 'is_verified', 'business_type', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'email', 'phone_number', 'alternate_phone_number')
        }),
        ('Business Information', {
            'fields': ('business_name', 'business_type', 'address')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ShopkeeperProduct)
class ShopkeeperProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'shopkeeper', 'price', 'stock_quantity', 'is_available', 'created_at')
    search_fields = ('name', 'shopkeeper__name', 'category')
    list_filter = ('is_available', 'category', 'created_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ShopkeeperOrder)
class ShopkeeperOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'shopkeeper', 'customer_name', 'total_amount', 'status', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'shopkeeper__name')
    list_filter = ('status', 'created_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ShopkeeperDocument)
class ShopkeeperDocumentAdmin(admin.ModelAdmin):
    list_display = ('document_name', 'shopkeeper', 'document_type', 'is_verified', 'uploaded_at')
    search_fields = ('document_name', 'shopkeeper__name')
    list_filter = ('document_type', 'is_verified', 'uploaded_at')

@admin.register(ShopkeeperReview)
class ShopkeeperReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer_name', 'shopkeeper', 'rating', 'is_verified', 'created_at')
    search_fields = ('reviewer_name', 'shopkeeper__name')
    list_filter = ('rating', 'is_verified', 'created_at')
    readonly_fields = ('created_at',)