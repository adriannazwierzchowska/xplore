from rest_framework import serializers
from .models import UserFavorite


class UserFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFavorite
        fields = ['place']

