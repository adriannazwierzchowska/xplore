from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_user, name='login_user'),
    path('register/', views.register_user, name='register_user'),
    path('logout/', views.logout_user, name='logout_user'),

    path('add_favorite/', views.add_favorite, name='add_favorite'),
    path('remove_favorite/', views.remove_favorite, name='remove_favorite'),
    path('is_favorite/', views.is_favorite, name='is_favorite'),
    path('favorites/', views.list_favorites, name='list_favorites'),
    path('favorite_count/', views.get_favorite_count, name='favorite_count'),
    path('community_top_favorites/', views.community_top_favorites, name='community_top_favorites'),

]
