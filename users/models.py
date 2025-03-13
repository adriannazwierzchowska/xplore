from django.db import models
from django.contrib.auth.models import User

class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username} - {self.place}"

class Place(models.Model):
    name = models.CharField(max_length=255, unique=True)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class UserLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'place')  # Zapobiega wielokrotnemu polubieniu tego samego miejsca przez jednego usera
