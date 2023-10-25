from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.postgres.fields import JSONField

# Create your models here.
class TomorrowIoRequest(models.Model):
    requestedAt = models.DateTimeField(null=True)
    requestQuery = models.CharField(max_length=250)
    location = models.PointField(geography=True, default=Point(0.0, 0.0))
    locationType = models.CharField(max_length=100)
    locationName = models.CharField(max_length=250)
    returnData = models.JSONField()

    def __str__(self):
        return self.locationName
