from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserAccount

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "date_joined"]

class UserAccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # prevent nested write errors
    profile_picture = serializers.ImageField(required=False, allow_null=True) # ✅ match model field

    class Meta:
        model = UserAccount
        fields = ['user', 'profile_picture', 'phone_number']

    def update(self, instance, validated_data):
        # ✅ Handle image update properly
        profile_picture = validated_data.pop("profile_picture", None)

        # Update non-image fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # ✅ If new image uploaded, assign it
        if profile_picture:
            instance.profile_picture = profile_picture

        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
