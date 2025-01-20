from django.urls import path
from .views import classify

urlpatterns = [
    path('classify/', classify, name='classify'),
]
