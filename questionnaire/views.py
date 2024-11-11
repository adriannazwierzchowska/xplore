from rest_framework import generics, permissions
from .models import UserResponse
from .serializers import UserResponseSerializer


class UserResponseCreateView(generics.CreateAPIView):
    queryset = UserResponse.objects.all()
    serializer_class = UserResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserResponseListView(generics.ListAPIView):
    serializer_class = UserResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserResponse.objects.filter(user=self.request.user)