from rest_framework import serializers
from .models import UserResponse

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResponse
        fields = '__all__'
        read_only_fields = ('user',)