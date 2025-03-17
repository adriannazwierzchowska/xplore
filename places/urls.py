from django.urls import path
from . import views

urlpatterns = [
    path('nearby-places/', views.get_nearby_places, name='nearby_places'),
    path('city-summary/', views.get_place_summary, name='city_summary'),
]