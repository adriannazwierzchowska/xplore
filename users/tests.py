from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import UserFavorite 

class UserAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register_user')
        self.login_url = reverse('login_user')
        self.logout_url = reverse('logout_user') 
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com'
        }
        self.client = APIClient()

    def test_register_user_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_user_username_taken(self):
        User.objects.create_user(username='testuser', password='anotherpassword')
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Username already taken')

    def test_login_user_success(self):
        User.objects.create_user(username='testuser', password='testpassword123')
        login_data = {'username': 'testuser', 'password': 'testpassword123'}
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['username'], 'testuser')

    def test_login_user_invalid_credentials(self):
        login_data = {'username': 'nonexistentuser', 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid credentials')

    def test_logout_user(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'testpassword123'}, format='json')
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.post(self.logout_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logged out successfully')


class UserFavoriteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='favuser', password='favpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=self.user.username)


        self.add_favorite_url = reverse('add_favorite')
        self.list_favorites_url = reverse('list_favorites')
        self.remove_favorite_url = reverse('remove_favorite')
        self.is_favorite_url = reverse('is_favorite') 
        self.community_top_favorites_url = reverse('community_top_favorites')

        self.place_data = {'place': 'Paris'}

    def test_add_favorite_place(self):
        response = self.client.post(self.add_favorite_url, self.place_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
        self.assertTrue(UserFavorite.objects.filter(user=self.user, place=self.place_data['place']).exists())

    def test_list_favorites(self):
        UserFavorite.objects.create(user=self.user, place='London')
        UserFavorite.objects.create(user=self.user, place='Berlin')
        
        response = self.client.get(self.list_favorites_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertIn('London', [fav['place'] for fav in response.data])

    def test_remove_favorite_place(self):
        favorite = UserFavorite.objects.create(user=self.user, place='Tokyo')
        remove_data = {'place': 'Tokyo'} 
        response = self.client.post(self.remove_favorite_url, remove_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertFalse(UserFavorite.objects.filter(id=favorite.id).exists())

    def test_community_top_favorites(self):
        user2 = User.objects.create_user(username='user2', password='password123')
        UserFavorite.objects.create(user=self.user, place="Eiffel Tower")
        UserFavorite.objects.create(user=user2, place="Eiffel Tower")
        UserFavorite.objects.create(user=self.user, place="Louvre Museum")
        
        
        
        response = self.client.get(self.community_top_favorites_url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        self.assertEqual(response.data[0]['place'], "Eiffel Tower") 
        self.assertEqual(response.data[0]['favorite_count'], 2)
