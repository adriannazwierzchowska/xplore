import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from unittest.mock import patch, MagicMock
from django.conf import settings

class PlacesViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.nearby_places_url = reverse('nearby_places') 
        self.search_flights_url = reverse('search_flights') 
        self.get_place_summary_url = reverse('city_summary') 
        self.get_nearest_airport_url = reverse('nearest_airport')


        settings.GOOGLE_API_KEY = 'test_google_api_key'
        settings.TRAVEL_PAYOUTS_TOKEN = 'test_travel_payouts_token'
        settings.OPENCAGE_API_KEY = 'test_opencage_api_key'

    @patch('places.views.requests.post')
    @patch('places.views.process_google_response') 
    def test_get_nearby_places_success(self, mock_process_google_response, mock_requests_post):
        mock_api_response = MagicMock()
        mock_api_response.json.return_value = {"places": [{"displayName": {"text": "Test Place"}}]}
        mock_api_response.status_code = 200
        mock_requests_post.return_value = mock_api_response

        mock_process_google_response.return_value = [{"name": "Processed Test Place"}] 

        data = {'lat': 40.7128, 'lng': -74.0060}
        response = self.client.post(self.nearby_places_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Accommodation', response.data) 
        self.assertTrue(len(response.data['Accommodation']) > 0) 
        mock_requests_post.assert_called() 
        mock_process_google_response.assert_called()

    def test_get_nearby_places_missing_params(self):
        response = self.client.post(self.nearby_places_url, {'lat': 40.7128}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Missing lat/lng parameters')

    @patch('places.views.requests.get') 
    def test_search_flights_success(self, mock_requests_get):
        mock_api_response = MagicMock()
        mock_api_response.json.return_value = {
            "success": True,
            "data": [
                {
                    "expected_price": 100, "airline": "AA", "flight_number": "AA123", 
                    "departure_at": "2024-12-01T10:00:00Z", "return_at": "2024-12-07T10:00:00Z",
                    "origin_airport": "JFK", "destination_airport": "LAX", "link": "/some/link",
                    "transfers": 0, "duration_to": 300, "duration_back": 300,
                    "gate": "SomeGate"
                }
            ],
            "currency": "USD"
        }
        mock_api_response.status_code = 200
        mock_requests_get.return_value = mock_api_response

        flight_data = {
            'origin': 'JFK',
            'destination': 'LAX',
            'month': '12',
            'year': '2024',
        }
        response = self.client.post(self.search_flights_url, flight_data, format='json')
        
        if hasattr(response, 'data'):
            response_data = response.data
        else:
            response_data = json.loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('flights', response_data)
        self.assertTrue(len(response_data['flights']) > 0)
        self.assertEqual(response_data['flights'][0]['price'], 100)
        self.assertEqual(response_data['flights'][0]['booking_link'], "https://aviasales.com/some/link")

    @patch('places.views.requests.get')
    def test_search_flights_api_failure(self, mock_requests_get):
        mock_api_response = MagicMock()
        mock_api_response.status_code = 500
        mock_api_response.text = "External API error details"
        mock_requests_get.return_value = mock_api_response

        flight_data = {
            'origin': 'JFK',
            'destination': 'LAX',
            'month': '12',
            'year': '2024',
        }
        response = self.client.post(self.search_flights_url, flight_data, format='json')

        self.assertNotEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertEqual(response.status_code, 500)

        response_data = json.loads(response.content)
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], f'API request failed with status {mock_api_response.status_code}')
        self.assertIn('details', response_data)
        self.assertEqual(response_data['details'], "External API error details")

    @patch('places.views.requests.get')
    def test_get_place_summary_success(self, mock_requests_get):
        mock_api_response = MagicMock()
        mock_api_response.json.return_value = {
            'extract': 'Test summary',
            'thumbnail': {'source': 'http://example.com/image.jpg'}
        }
        mock_api_response.status_code = 200
        mock_requests_get.return_value = mock_api_response

        response = self.client.get(self.get_place_summary_url, {'city': 'TestCity, TC'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['details'], 'Test summary')
        self.assertEqual(response.data['image'], 'http://example.com/image.jpg')
        mock_requests_get.assert_called_once_with(
            f'https://en.wikipedia.org/api/rest_v1/page/summary/TC',
            headers={'Accept': 'application/json'}
        )
    
    @patch('places.views.find_nearest_airport_opencage')
    def test_get_nearest_airport_success(self, mock_find_airport):
        mock_find_airport.return_value = "LHR"
        response = self.client.get(self.get_nearest_airport_url, {'place': 'London'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['airport_code'], "LHR")

    def test_get_nearest_airport_no_place(self):
        response = self.client.get(self.get_nearest_airport_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['error'], 'Place parameter is required')
