import logging

from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserFavorite
from .serializers import UserFavoriteSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions



@api_view(['POST'])
@csrf_exempt
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@csrf_exempt
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'username': user.username}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def current_user(request):
#     return Response({"username": request.user.username}, status=200)

@api_view(['POST'])
def add_favorite(request):
    token = request.headers.get('Authorization')
    print(token)
    # if not token:
    #     return Response({'error': 'Authorization token is required'}, status=401)

    try:
        user = User.objects.get(username=token)
    except User.DoesNotExist:
        return Response({'error': 'Invalid token or user does not exist'}, status=401)

    place = request.data.get('place')
    if not place:
        return Response({'error': 'Place is required'}, status=400)

    favorite, created = UserFavorite.objects.get_or_create(user=user, place=place)
    favorite_count = UserFavorite.objects.filter(place=place).count()
    print(favorite_count)

    if created:
        return Response({'message': 'Added to favorites'}, status=201)
    return Response({'message': 'Already in favorites', 'favorite_count': favorite_count}, status=200)


@api_view(['GET'])
def list_favorites(request):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Authorization token is required'}, status=401)

    try:
        user = User.objects.get(username=token)
    except User.DoesNotExist:
        return Response({'error': 'Invalid token or user does not exist'}, status=401)

    favorites = UserFavorite.objects.filter(user=user)
    serializer = UserFavoriteSerializer(favorites, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_favorite_count(request):
    place = request.GET.get('place')
    if place:
        count = UserFavorite.objects.filter(place=place).count()
        print(count)
        return Response({'favorite_count': count})
    return Response({'error': 'Place not provided'}, status=400)


