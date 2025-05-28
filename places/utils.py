from django.conf import settings
# from django.core.cache import cache
import requests


def normalize_coordinates(lat, lng):
    return float(lat), float(lng)

def process_google_response(response):
    processed = []
    for place in response.get('places', []):
        if not place.get('photos'):
            continue
        # cache_key = f"place_photo_{place.get('websiteUri')}"
        # photo_url = cache.get(cache_key)

        # if not photo_url and place.get('photos'):
        photo_ref = place['photos'][0]['name']
        photo_url = f"https://places.googleapis.com/v1/{photo_ref}/media?key={settings.GOOGLE_API_KEY}&maxHeightPx=400"
        # cache.set(cache_key, photo_url, 86400)

        processed.append({
            'name': place.get('displayName', {}).get('text'),
            'rating': place.get('rating'),
            'user_ratings_total': place.get('userRatingCount'),
            'reviews': [{
                'text': review.get('text', {}).get('text')
            } for review in place.get('reviews', [])[:1]],
            'location': place.get('location'),
            'website': place.get('websiteUri'),
            'photo': photo_url
        })

    processed.sort(key=lambda x: x['rating'], reverse=True)

    return processed


def find_nearest_airport_opencage(place):
    OPENCAGE_API_KEY = settings.OPENCAGE_API_KEY

    try:
        geocoding_url = "https://api.opencagedata.com/geocode/v1/json"
        geocoding_params = {
            'q': place,
            'key': OPENCAGE_API_KEY,
            'limit': 1,
            'language': 'en'
        }

        geocoding_response = requests.get(geocoding_url, params=geocoding_params, timeout=10)

        if geocoding_response.status_code != 200:
            return None

        geocoding_data = geocoding_response.json()

        if not geocoding_data.get('results'):
            return None

        location = geocoding_data['results'][0]['geometry']
        lat, lng = location['lat'], location['lng']

        return find_nearest_airport_by_coordinates(lat, lng)

    except Exception as e:
        print(f"OpenCage geocoding failed for {place}: {str(e)}")
        return None


def find_nearest_airport_by_coordinates(lat, lng):
    try:
        airport_url = "https://api.travelpayouts.com/data/en/airports.json"

        response = requests.get(airport_url, timeout=30)

        if response.status_code != 200:
            return None

        airports_data = response.json()

        min_distance = float('inf')
        nearest_airport = None

        for airport in airports_data:
            if airport.get('iata_type') != 'airport':
                continue

            if not airport.get('flightable', False):
                continue

            coordinates = airport.get('coordinates', {})
            airport_lat = coordinates.get('lat')
            airport_lng = coordinates.get('lon')

            if airport_lat is None or airport_lng is None:
                continue

            distance = calculate_distance(lat, lng, airport_lat, airport_lng)

            if distance < min_distance:
                min_distance = distance
                nearest_airport = airport.get('code')
        return nearest_airport if nearest_airport else None

    except Exception as e:
        print(f"Airport search by coordinates failed: {str(e)}")
        return None


def calculate_distance(lat1, lng1, lat2, lng2):
    import math

    lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])

    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))

    r = 6371

    return c * r