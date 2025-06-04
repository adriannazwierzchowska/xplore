from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from unittest.mock import patch, MagicMock
from .models import UserResponse 
import pandas as pd

class QuestionnaireViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.client = APIClient()

        self.classify_url = reverse('classify')
        self.place_coordinates_url = reverse('place_coordinates')
        self.keywords_url = reverse('keywords')


        self.classify_data_single_month = {
            "month": "1", 
            "weather": "3",
            "land_city": "1",
            "land_mountains": "0",
            "land_sea": "1",
            "land_lake": "0",
            "act_water": "1",
            "act_sightseeing": "1",
            "act_museums": "0",
            "act_beach": "1",
            "act_nature": "0", 
            "act_sports": "0", 
            "act_nightlife": "1",
            "acc_agrotourism": "0",
            "acc_airbnb": "1",
            "acc_camping": "0",
            "acc_guesthouse": "0",
            "acc_hostel": "0",
            "acc_hotel": "1",
            "cuisine": "4"
        }

    @patch('questionnaire.views.joblib.load')
    @patch('questionnaire.views.OpenCageGeocode')
    @patch('questionnaire.views.pd.read_csv')
    def test_classify_view_success(self, mock_read_csv, mock_opencage, mock_joblib_load):
        mock_model = MagicMock()
        mock_model.predict_proba.return_value = [[0.8, 0.1, 0.1]] 
        mock_model.classes_ = ['Paris', 'London', 'Berlin']
        mock_joblib_load.return_value = mock_model

        mock_geocoder_instance = MagicMock()
        mock_geocoder_instance.geocode.return_value = [{'geometry': {'lat': 48.8566, 'lng': 2.3522}}]
        mock_opencage.return_value = mock_geocoder_instance
        
        mock_cuisine_df = pd.DataFrame({'destination': ['Paris', 'London', 'Berlin'], 'cuisine': [5, 4, 3]})
        mock_keywords_df = pd.DataFrame({'destination': ['Paris', 'London', 'Berlin'], 'w1': ['art', 'history', 'beer'], 'w2': ['a','b','c'], 'w3': ['x','y','z']})
        mock_read_csv.side_effect = [mock_cuisine_df, mock_keywords_df]
        
        response = self.client.post(self.classify_url, self.classify_data_single_month, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('predictions', response.data)

    def test_classify_view_missing_month(self):
        data = self.classify_data_single_month.copy()
        del data['month']
        response = self.client.post(self.classify_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    @patch('questionnaire.views.OpenCageGeocode')
    def test_get_place_coordinates_success(self, mock_opencage):
        mock_geocoder_instance = MagicMock()
        mock_geocoder_instance.geocode.return_value = [{'geometry': {'lat': 51.5074, 'lng': 0.1278}}]
        mock_opencage.return_value = mock_geocoder_instance

        response = self.client.get(self.place_coordinates_url, {'place': 'London'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('coordinates', response.data)
        self.assertEqual(response.data['coordinates']['lat'], 51.5074)

    def test_get_place_coordinates_no_place(self):
        response = self.client.get(self.place_coordinates_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Place not provided')

    @patch('questionnaire.views.pd.read_csv')
    def test_get_keywords_success(self, mock_read_csv):
        data = {
            'destination': ['SomeOtherPlace', 'TestDestination', 'AnotherPlace'],
            'w1': ['other_kw1', 'kw1', 'foo1'],
            'w2': ['other_kw2', 'kw2', 'foo2'],
            'w3': ['other_kw3', 'kw3', 'foo3']
        }
        mock_df_instance = pd.DataFrame(data)
        mock_read_csv.return_value = mock_df_instance
        
        response = self.client.get(self.keywords_url, {'destination': 'TestDestination'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('keywords', response.data)
        self.assertEqual(response.data['keywords'], ['kw1', 'kw2', 'kw3'])

    def test_get_keywords_no_destination(self):
        response = self.client.get(self.keywords_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Destination parameter is required')
