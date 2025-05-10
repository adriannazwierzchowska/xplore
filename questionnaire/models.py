from django.contrib.auth.models import User
from django.db import models


class UserResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.CharField(max_length=20)
    weather = models.IntegerField()  # 1 – very cold, 5 – very hot
    acc_hotel = models.BooleanField(default=False)
    acc_hostel = models.BooleanField(default=False)
    acc_guesthouse = models.BooleanField(default=False)
    acc_agrotourism = models.BooleanField(default=False)
    acc_camping = models.BooleanField(default=False)
    acc_airbnb = models.BooleanField(default=False)
    land_mountains = models.BooleanField(default=False)
    land_sea = models.BooleanField(default=False)
    land_lake = models.BooleanField(default=False)
    land_city = models.BooleanField(default=False)
    act_water = models.BooleanField(default=False)
    act_sightseeing = models.BooleanField(default=False)
    act_museums = models.BooleanField(default=False)
    act_nightlife = models.BooleanField(default=False)
    act_beach = models.BooleanField(default=False)
    act_nature = models.BooleanField(default=False)
    act_sports = models.BooleanField(default=False)
    cuisine = models.IntegerField()  # 1 – not important, 5 – very important

    def __str__(self):
        return f"Responses from {self.user.username}"
