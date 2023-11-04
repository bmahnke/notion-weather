from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

# Create your models here.
class TomorrowIoRequest(models.Model):
    requestedAt = models.DateTimeField(null=True)
    units = models.CharField(max_length=50)
    locationQuery = models.CharField(max_length=100)
    timesteps = models.CharField(max_length=100, null=True)
    location = models.PointField(geography=True, default=Point(0.0, 0.0))
    locationType = models.CharField(max_length=100, null=True)
    locationName = models.CharField(max_length=250, null=True)
    returnData = models.JSONField()

    def __str__(self):
        return self.locationName
