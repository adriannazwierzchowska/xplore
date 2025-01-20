from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.login_user, name='login_user'),
    path('register/', views.register_user, name='register_user'),
    path('logout/', views.logout_user, name='logout_user'),
    #path('current_user/', views.current_user, name='current_user'),
    path('add_favorite/', views.add_favorite, name='add_to_favorites'),
    path('favorites/', views.list_favorites, name='list_favorites'),
]
