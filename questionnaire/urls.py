from django.urls import path
from .views import UserResponseCreateView, UserResponseListView

urlpatterns = [
    path('responses/', UserResponseCreateView.as_view(), name='submit-response'),
    path('responses/me/', UserResponseListView.as_view(), name='user-responses'),
]
