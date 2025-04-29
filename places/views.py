from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from django.conf import settings
from .utils import normalize_coordinates, process_google_response
import time

# PLACE_TYPES = [
#   {'category': 'Accommodation', 'types': ['bed_and_breakfast','budget_japanese_inn', 'campground',  'camping_cabin'
#                                           'cottage', 'extended_stay_hotel', 'farmstay', 'guest_house', 'hostel',
#                                           'hotel', 'inn', 'japanese_inn', 'lodging', 'mobile_home_park', 'motel', 'private_guest_room',
#                                           'resort_hotel', 'rv_park']},
# ]

# max 5 miejsc na zapytanie mozna

PLACE_TYPES = [
  {
    'category': 'Accommodation',
    'types': ['hotel', 'motel', 'bed_and_breakfast', 'inn', 'guest_house']
  },
  {
    'category': 'Food',
    'types': ['restaurant', 'cafe', 'bakery', 'bar', 'wine_bar']
  },
  {
    'category': 'Entertainment',
    'types': ['art_gallery', 'tourist_attraction', 'amusement_park', 'museum', 'park']
  },
  {
    'category': 'Sightseeing',
    'types': ['historical_landmark', 'monument', 'national_park', 'beach', 'church']
  }
]

@api_view(['POST'])
def get_nearby_places(request):
    try:
        lat = request.data.get('lat')
        lng = request.data.get('lng')

        normalized_lat, normalized_lng = normalize_coordinates(lat, lng)
        places_data = {}

        key = settings.GOOGLE_API_KEY

        for category in PLACE_TYPES:
            response = requests.post(
                'https://places.googleapis.com/v1/places:searchNearby',
                json={
                    'includedTypes': category['types'],
                    'maxResultCount': 4,
                    'locationRestriction': {
                        'circle': {
                            'center': {
                                'latitude': normalized_lat,
                                'longitude': normalized_lng
                            },
                            'radius': 2000.0
                        }
                    },
                },
                headers={
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': key,
                    'X-Goog-FieldMask': 'places.displayName,places.rating,places.reviews,places.formattedAddress,places.location,places.websiteUri,places.userRatingCount,places.accessibilityOptions,places.parkingOptions,places.paymentOptions,places.photos'
                }
            )
            time.sleep(0.5)

            places_data[category['category']] = process_google_response(response.json())

        return Response(places_data)

    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_place_summary(request):
    try:
        city_name = request.GET.get('city')
        processed_name = city_name.split(',')[-1].strip()

        response = requests.get(
            f'https://en.wikipedia.org/api/rest_v1/page/summary/{processed_name}',
            headers={'Accept': 'application/json'}
        )

        data = response.json()
        return Response({
            'details': data.get('extract', 'No description available'),
            'image': data.get('thumbnail', {}).get('source')
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)