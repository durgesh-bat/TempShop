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
            cart = get_object_or_404(Cart, user=request.user)
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ➕ PUT (or POST): Add product to cart
    def post(self, request, product_id):
        try:
            quantity = request.data.get("quantity", None)
            if quantity is None:
                return Response({"error": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)
            
            product = get_object_or_404(Product, id=product_id)
            print(f"Product: {product}")
            cart, _ = Cart.objects.get_or_create(user=request.user)

            # Create or update CartItem
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart, product=product,
                defaults={'quantity': 1}
            )
            if not created:
                if quantity<1:
                    if cart_item.quantity<=0:
                        cart_item.quantity = 0
                    else:
                        cart_item.quantity -=1 
                else:
                    cart_item.quantity += 1
                cart_item.save()    

            return Response({
                "message": f"{product.name} added to cart",
                "quantity": cart_item.quantity
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error : {e}")
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
    





