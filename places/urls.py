from django.urls import path
from .views import get_nearby_places, get_place_summary, search_flights, get_nearest_airport

urlpatterns = [
    path('nearby-places/', get_nearby_places, name='nearby_places'),
    path('city-summary/', get_place_summary, name='city_summary'),
    path('search-flights/', search_flights, name='search_flights'),
    path('nearest-airport/', get_nearest_airport, name='nearest_airport'),
]