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
from .models import Place, UserLike



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
    if not token:
        return Response({'error': 'Authorization token is required'}, status=401)

    try:
        user = User.objects.get(username=token)
    except User.DoesNotExist:
        return Response({'error': 'Invalid token or user does not exist'}, status=401)

    place = request.data.get('place')
    if not place:
        return Response({'error': 'Place is required'}, status=400)

    favorite, created = UserFavorite.objects.get_or_create(user=user, place=place)
    if created:
        return Response({'message': 'Added to favorites'}, status=201)
    return Response({'message': 'Already in favorites'}, status=200)


@api_view(['GET'])
def list_favorites(request):
    token = request.headers.get('Authorization')  # Pobranie tokena z nagłówka
    if not token:
        return Response({'error': 'Authorization token is required'}, status=401)

    try:
        user = User.objects.get(username=token)  # Znajdź użytkownika na podstawie tokena (username)
    except User.DoesNotExist:
        return Response({'error': 'Invalid token or user does not exist'}, status=401)

    favorites = UserFavorite.objects.filter(user=user)  # Pobranie ulubionych miejsc użytkownika
    serializer = UserFavoriteSerializer(favorites, many=True)
    return Response(serializer.data)

class LikePlaceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        place_name = request.data.get('place')
        if not place_name:
            return Response({'error': 'Place is required'}, status=status.HTTP_400_BAD_REQUEST)

        place, created = Place.objects.get_or_create(name=place_name)

        if UserLike.objects.filter(user=request.user, place=place).exists():
            return Response({'message': 'You already liked this place!'}, status=status.HTTP_400_BAD_REQUEST)

        # Dodajemy polubienie
        UserLike.objects.create(user=request.user, place=place)
        place.likes += 1
        place.save()

        return Response({'message': 'Place liked!', 'likes': place.likes}, status=status.HTTP_201_CREATED)

class UnlikePlaceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        place_name = request.data.get('place')
        if not place_name:
            return Response({'error': 'Place is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            place = Place.objects.get(name=place_name)
        except Place.DoesNotExist:
            return Response({'error': 'Place not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            user_like = UserLike.objects.get(user=request.user, place=place)
            user_like.delete()

            if place.likes > 0:
                place.likes -= 1
                place.save()

            return Response({'message': 'Place unliked', 'likes': place.likes}, status=status.HTTP_200_OK)

        except UserLike.DoesNotExist:
            return Response({'error': 'You haven\'t liked this place yet'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_likes(request):
    places = request.data.get('places', [])
    if not places:
        return Response({'error': 'Places list is required'}, status=status.HTTP_400_BAD_REQUEST)

    likes_data = {}
    for place_name in places:
        place = Place.objects.filter(name=place_name).first()
        likes_data[place_name] = place.likes if place else 0

    return Response({'likes': likes_data}, status=status.HTTP_200_OK)
