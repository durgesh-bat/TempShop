from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from account.models import UserAccount
from .serializers import RegisterSerializer,UserSerializer, LoginSerializer, UserAccountSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            # Get phone_number from request if provided
            phone_number = request.data.get('phone_number', '')
            UserAccount.objects.create(user=user, phone_number=phone_number)
            
            tokens = get_tokens_for_user(user)
            return Response({
                "user": UserAccountSerializer(user.useraccount).data,
                "tokens": tokens
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "error": "Registration failed",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user:
            tokens = get_tokens_for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "tokens": tokens
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # allow file upload

    def get(self, request):
        user_account = get_object_or_404(UserAccount, user=request.user)
        serializer = UserAccountSerializer(user_account)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        try:
            user = request.user
            user_account = UserAccount.objects.get(user=user)
            
            # Update User model fields separately
            user_data = {}
            if 'username' in request.data:
                user_data['username'] = request.data['username']
            if 'email' in request.data:
                user_data['email'] = request.data['email']
            if 'first_name' in request.data:
                user_data['first_name'] = request.data['first_name']
            if 'last_name' in request.data:
                user_data['last_name'] = request.data['last_name']
            
            # Update User fields
            for field, value in user_data.items():
                setattr(user, field, value)
            user.save()
        except UserAccount.DoesNotExist:
            return Response({"error": "User account not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Failed to update profile: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Update UserAccount fields (phone_number, profile_picture)
        serializer = UserAccountSerializer(user_account, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
