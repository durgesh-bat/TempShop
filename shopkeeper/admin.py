from django.contrib import admin
from .models import Shopkeeper, ShopkeeperProduct, ShopkeeperOrder, ShopkeeperDocument, ShopkeeperReview

# Register your models here.

@admin.register(Shopkeeper)
class ShopkeeperAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'phone_number', 'business_name', 'is_active', 'is_verified', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'phone_number', 'business_name')
    list_filter = ('is_active', 'is_verified', 'is_staff', 'business_type', 'date_joined')
    readonly_fields = ('date_joined', 'last_login')
    fieldsets = (
        ('Account Information', {
            'fields': ('username', 'password', 'email')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'phone_number', 'alternate_phone_number', 'profile_picture')
        }),
        ('Business Information', {
            'fields': ('business_name', 'business_type', 'address')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified')
        }),
        ('Timestamps', {
            'fields': ('date_joined', 'last_login'),
            'classes': ('collapse',)
        })
    )

@admin.register(ShopkeeperProduct)
class ShopkeeperProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'shopkeeper', 'product', 'stock_quantity', 'product_is_available', 'product_created_date')
    search_fields = ('product__name', 'shopkeeper__username')
    list_filter = ('product__is_available', 'product__created_at')

    def product_name(self, obj):
        return obj.product.name
    product_name.short_description = "Product Name"

    def product_is_available(self, obj):
        return obj.product.is_available
    product_is_available.short_description = "Available"
    product_is_available.boolean = True

    def product_created_date(self, obj):
        return obj.product.created_at
    product_created_date.short_description = "Product Created"



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