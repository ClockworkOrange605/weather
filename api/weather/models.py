from django.db import models

class Weather(models.Model):
    dt = models.DateTimeField()
    temp = models.IntegerField()
    pressure = models.IntegerField()
    humidity = models.IntegerField()
