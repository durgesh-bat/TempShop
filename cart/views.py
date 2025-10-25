from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from product.models import Product
from .serializers import CartSerializer, CartItemSerializer


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    # 🛒 GET: Retrieve user's cart
    def get(self, request):
        try:
            cart, created = Cart.objects.get_or_create(user=request.user)
            if created or not cart.items.exists():
                # Return empty cart instead of 404
                return Response({"items": []}, status=status.HTTP_200_OK)

            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Exception in CartView:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ➕ POST: Add product to cart
    def post(self, request, product_id):
        try:
            quantity = int(request.data.get("quantity", 1))
            if quantity < 1:
                quantity = 1

            product = get_object_or_404(Product, id=product_id)
            cart, _ = Cart.objects.get_or_create(user=request.user)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart, product=product, defaults={"quantity": quantity}
            )
            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return Response({
                "message": f"{product.name} added to cart",
                "quantity": cart_item.quantity
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error adding to cart: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ❌ DELETE: Remove product from cart
    def delete(self, request, product_id):
        try:
            cart = get_object_or_404(Cart, user=request.user)
            cart_item = get_object_or_404(CartItem, cart=cart, product__id=product_id)
            cart_item.delete()
            return Response({"message": "Item removed from cart"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # âœ� PATCH: Update cart item quantity
    def patch(self, request, product_id):
        try:
            # Validate product_id
            try:
                product_id = int(product_id)
                if product_id <= 0:
                    return Response({"error": "Invalid product ID"}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError):
                return Response({"error": "Invalid product ID"}, status=status.HTTP_400_BAD_REQUEST)
            
            cart = get_object_or_404(Cart, user=request.user)
            cart_item = get_object_or_404(CartItem, cart=cart, product__id=product_id)
            
            # Validate quantity parameter
            try:
                new_quantity = int(request.data.get("quantity", cart_item.quantity))
                if new_quantity < 0:
                    return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError):
                return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)
            
            if new_quantity < 1:
                cart_item.delete()
                return Response({"message": "Item removed from cart"}, status=status.HTTP_200_OK)
            
            cart_item.quantity = new_quantity
            cart_item.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)






