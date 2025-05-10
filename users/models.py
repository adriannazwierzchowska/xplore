from django.db import models
from django.contrib.auth.models import User

class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username} - {self.place}"


