from django.urls import path
from .views import UserResponseCreateView

urlpatterns = [
    path('responses/', UserResponseCreateView.as_view(), name='submit-response'),
]
