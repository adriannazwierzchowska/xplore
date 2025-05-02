from django.urls import path
from .views import classify, get_place_coordinates, get_keywords

urlpatterns = [
    path('classify/', classify, name='classify'),
    path('place_coordinates/', get_place_coordinates, name='place_coordinates'),
    path('keywords/', get_keywords, name='keywords'),
]
