from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
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
        login(request, user)
        return Response({"message": "Logged in successfully"}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# zapytanie w javascripcie:
# async function register(username, password, email) {
#     const response = await fetch('http://localhost:8000/api/register/', {
#         method: 'POST',
#         headers: { 'Content-Type': 'application/json' },
#         body: JSON.stringify({ username, password, email })
#     });
#     const data = await response.json();
#     console.log(data);
# }
