from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from questionnaire.models import UserResponse

class UserAuthenticationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register_user')
        self.login_url = reverse('login_user')
        self.logout_url = reverse('logout_user')
        self.test_user_data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com'
        }

    def test_user_registration(self):
        # Testing successful registration
        response = self.client.post(self.register_url, self.test_user_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

        # Testing error response caused by trying to register with a duplicate username
        response = self.client.post(self.register_url, self.test_user_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        # Creating a user with the test data
        User.objects.create_user(**self.test_user_data)

        # Testing successful login
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, login_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Testing error response caused by trying to login with invalid credentials
        invalid_data = {
            'username': 'testuser',
            'password': 'wrongpass'
        }
        response = self.client.post(self.login_url, invalid_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_logout(self):
        # Creating and logging in a user
        User.objects.create_user(**self.test_user_data)
        self.client.post(self.login_url, 
                        {'username': 'testuser', 'password': 'testpass123'},
                        content_type='application/json')

        # Testing logout
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserResponseTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        self.client = Client()
        self.client.login(username='testuser', password='testpass123')
        self.response_url = reverse('submit-response')
        self.response_data = {
            'month': 'July',
            'weather': 5,
            'acc_hotel': True,
            'acc_hostel': False,
            'acc_guesthouse': False,
            'acc_agrotourism': False,
            'acc_camping': True,
            'acc_airbnb': False,
            'land_mountains': True,
            'land_sea': False,
            'land_lake': True,
            'land_city': False,
            'act_water': True,
            'act_sightseeing': False,
            'act_museums': False,
            'act_nightlife': True,
            'act_beach': True,
            'act_nature': False,
            'act_sports': True,
            'cuisine': 4
        }

    def test_create_user_response(self):
        response = self.client.post(
            self.response_url, 
            data=self.response_data,
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verifying that the response was saved in database
        self.assertTrue(UserResponse.objects.filter(user=self.user).exists())
        saved_response = UserResponse.objects.get(user=self.user)
        self.assertEqual(saved_response.month, 'July')
        self.assertEqual(saved_response.weather, 5)
        self.assertEqual(saved_response.cuisine, 4)

    def test_get_user_responses(self):
        # Creating a response for the user
        UserResponse.objects.create(user=self.user, **self.response_data)

        # Testing getting user's responses
        response = self.client.get(reverse('user-responses'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_unauthorized_access(self):
        # Logging out user
        self.client.logout()

        # Testing error response caused by trying to submit a response while logged out
        response = self.client.post(self.response_url, self.response_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Testing error response caused by trying to get user's responses while logged out
        response = self.client.get(reverse('user-responses'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)