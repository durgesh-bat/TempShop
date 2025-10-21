from rest_framework.decorators import api_view
from .models import Product, Category,SubCategory
from .serializers import ProductSerializer,CategoryWithSubcategoriesSerializer
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status




class ProductDetailView(APIView):
    def get(self, request, id, format=None):
        """Return a single product by ID"""
        product = get_object_or_404(Product, id=id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

class product_view(APIView):
    def get(self, request, format=None):
        products = Product.objects.all()
        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data)
    def post(self,request, format=None):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategoryWithSubcategoriesSerializer(categories, many=True)
    return Response(serializer.data)


    

    