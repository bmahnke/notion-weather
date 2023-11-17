from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.postgres.fields import ArrayField
from datetime import datetime

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

class Address(models.Model):
    address1 = models.CharField(max_length=100, null=True)
    address2 = models.CharField(max_length=100, null=True)
    address3 = models.CharField(max_length=100, null=True)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100, null=True)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, null=True)
    postalCode = models.CharField(max_length=10, null=True)
    formattedAddress = models.CharField(max_length=400, null=True)
    createdAt = models.DateTimeField(default=datetime.utcnow)
    updatedAt = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.formattedAddress 

class GoogleMapApiRequest(models.Model):
    createdAt = models.DateTimeField(default=datetime.utcnow)
    placeId = models.CharField(max_length=100)
    address = models.ForeignKey("Address", on_delete=models.RESTRICT)
    locationType = models.CharField(max_length=100, null=True)
    types = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    location = models.PointField(geography=True, default=Point(0.0, 0.0))
    apiResult = models.JSONField()

    def __str__(self) -> str:
        return self.placeId

    class Meta:
        indexes = [
            models.Index(
                name="gmar_placeId_createdAt_idx",
                fields=["placeId", "createdAt"]
            ),
            # models.Index(
            #     name="gmar_placeId_idx",
            #     fields=["placeId"]
            # )
        ]

