from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from django.conf import settings
from .utils import normalize_coordinates, process_google_response, find_nearest_airport_opencage
import time
import json
import re
from django.http import JsonResponse



DESTINATION_KEYWORDS_PATH = "./model/destinations_key_words.csv"

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

        if lat is None or lng is None:
            return Response({'error': 'Missing lat/lng parameters'}, status=400)

        normalized_lat, normalized_lng = normalize_coordinates(lat, lng)
        places_data = {}

        print(lat, lng)

        key = settings.GOOGLE_API_KEY

        for category in PLACE_TYPES:
            response = requests.post(
                'https://places.googleapis.com/v1/places:searchNearby',
                json={
                    'includedTypes': category['types'],
                    'maxResultCount': 5,
                    'locationRestriction': {
                        'circle': {
                            'center': {
                                'latitude': normalized_lat,
                                'longitude': normalized_lng
                            },
                            'radius': 10000.0
                        }
                    },
                },
                headers={
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': key,
                    'X-Goog-FieldMask': 'places.displayName,places.rating,places.reviews,places.formattedAddress,places.location,places.websiteUri,places.userRatingCount,places.accessibilityOptions,places.parkingOptions,places.paymentOptions,places.photos'
                }
            )
            #print("GOOGLE RESPONSE:", response.json())
            time.sleep(0.2)

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

@api_view(['POST'])
def search_flights(request):
    try:
        data = json.loads(request.body)
        origin = data.get('origin')
        destination = data.get('destination')
        month = data.get('month')
        year = data.get('year')

        if not all([origin, destination, month, year]):
            return JsonResponse({
                'error': 'Missing required parameters: origin, destination, month, year'
            }, status=400)

        API_TOKEN = '91c93597821882db500c1b0f18685d46'

        month_formatted = f"{int(month):02d}"
        departure_at = f"{year}-{month_formatted}"
        return_at = f"{year}-{month_formatted}"

        url = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates"

        params = {
            "origin": origin,
            "destination": destination,
            "departure_at": departure_at,
            "return_at": return_at,
            "currency": "eur",
            "token": API_TOKEN
        }

        def extract_price_from_url(url):
            match = re.search(r"expected_price=(\d+)", url)
            if match:
                return match.group(1)
            return None

        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json().get("data", [])
            if not data:
                return JsonResponse({
                    'flights': [],
                    'message': 'No flights available for the selected period'
                })

            flights = []
            for flight in data:
                price = flight.get("expected_price")
                link = flight.get("link", "")

                if not price and link:
                    price = extract_price_from_url(link)

                depart_date = flight.get("departure_at", "")[:10]
                return_date = flight.get("return_at", "")[:10]
                seller = flight.get("gate") or flight.get("provider") or "aviasales"
                full_link = f"https://aviasales.com{link}" if link.startswith("/") else link

                flights.append({
                    'price': price,
                    'departure_date': depart_date,
                    'return_date': return_date if return_date else None,
                    'seller': seller,
                    'booking_link': full_link,
                    'origin': origin,
                    'destination': destination
                })

            return JsonResponse({
                'flights': flights,
                'message': f'Found {len(flights)} flights'
            })
        else:
            return JsonResponse({
                'error': f'API request failed with status {response.status_code}',
                'details': response.text
            }, status=500)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get_nearest_airport(request):
    place = request.GET.get('place')
    if not place:
        return JsonResponse({'error': 'Place parameter is required'}, status=400)

    try:
        airport_code = find_nearest_airport_opencage(place)

        if airport_code:
            return JsonResponse({
                'airport_code': airport_code,
                'place': place,
                'method': 'opencage_geocoding'
            })

        return JsonResponse({
            'airport_code': 'CDG',
            'place': place,
            'method': 'fallback',
            'note': 'Could not find specific airport, using Paris CDG as default'
        })

    except Exception as e:
        return JsonResponse({
            'airport_code': 'CDG',
            'place': place,
            'method': 'error_fallback',
            'error': str(e)
        })
