from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_user, name='login_user'),
    path('register/', views.register_user, name='register_user'),
    path('logout/', views.logout_user, name='logout_user'),

    # Favorite places
    path('add_favorite/', views.add_favorite, name='add_favorite'),
    path('favorites/', views.list_favorites, name='list_favorites'),

    # Like / Unlike a place
    path('like_place/', views.LikePlaceView.as_view(), name='like_place'),
    path('unlike_place/', views.UnlikePlaceView.as_view(), name='unlike_place'),

    # Get likes for multiple places
    path('get_likes/', views.get_likes, name='get_likes'),
]
