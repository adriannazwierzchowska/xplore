from django.conf import settings
# from django.core.cache import cache


def normalize_coordinates(lat, lng):
    return float(lat), float(lng)

def process_google_response(response):
    processed = []
    for place in response.get('places', []):
        # cache_key = f"place_photo_{place.get('websiteUri')}"
        # photo_url = cache.get(cache_key)

        # if not photo_url and place.get('photos'):
        if place.get('photos'):
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

    return processed