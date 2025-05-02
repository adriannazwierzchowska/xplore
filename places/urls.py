from django.urls import path
from .views import get_nearby_places, get_place_summary

urlpatterns = [
    path('nearby-places/', get_nearby_places, name='nearby_places'),
    path('city-summary/', get_place_summary, name='city_summary'),
]