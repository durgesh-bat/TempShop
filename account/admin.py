from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Client, Address, Wallet, PaymentMethod, Order, OrderItem, Review, Wishlist, RevokedToken

@admin.register(Client)
class ClientAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone_number', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'phone_number')
    list_filter = ('is_active', 'date_joined')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'profile_picture')}),
    )

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'label', 'city', 'state', 'is_default')
    list_filter = ('is_default',)
    search_fields = ('user__username', 'city', 'state')

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'created_at')
    search_fields = ('user__username',)

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'card_type', 'last_four', 'is_default')
    list_filter = ('card_type', 'is_default')
    search_fields = ('user__username',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username',)
    inlines = [OrderItemInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'product__name')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'added_at')
    search_fields = ('user__username', 'product__name')

@admin.register(RevokedToken)
class RevokedTokenAdmin(admin.ModelAdmin):
    list_display = ('jti_short', 'user', 'token_type', 'revoked_at', 'expires_at')
    list_filter = ('token_type', 'revoked_at')
    search_fields = ('user__username', 'jti')
    readonly_fields = ('jti', 'user', 'revoked_at', 'expires_at', 'token_type')
    
    def jti_short(self, obj):
        return f"{obj.jti[:16]}..."
    jti_short.short_description = 'JTI'
