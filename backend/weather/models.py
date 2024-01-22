from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.postgres.fields import ArrayField
from datetime import datetime

# Create your models here.
class TomorrowIoRequest(models.Model):
    requested_at = models.DateTimeField(null=True)
    units = models.CharField(max_length=50)
    location_query = models.CharField(max_length=100)
    timesteps = models.CharField(max_length=100, null=True)
    google_map_request = models.ForeignKey("GoogleMapApiRequest", on_delete=models.CASCADE)
    return_data = models.JSONField()

class Address(models.Model):
    plus_code = models.CharField(max_length=100, null=True)
    compound_code = models.CharField(max_length=100, null=True)
    global_code = models.CharField(max_length=100, null=True)
    address_1 = models.CharField(max_length=100, null=True)
    address_2 = models.CharField(max_length=100, null=True)
    address_3 = models.CharField(max_length=100, null=True)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100, null=True)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, null=True)
    postal_code = models.CharField(max_length=10, null=True)
    formatted_address = models.CharField(max_length=400, null=True)
    created_at = models.DateTimeField(default=datetime.utcnow)
    updated_at = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.formatted_address 

class GoogleMapApiRequest(models.Model):
    created_at = models.DateTimeField(default=datetime.utcnow)
    place_id = models.CharField(max_length=150)
    address = models.ForeignKey("Address", on_delete=models.RESTRICT)
    location_type = models.CharField(max_length=100, null=True)
    types = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    location = models.PointField(geography=True, default=Point(0.0, 0.0))
    api_result = models.JSONField()

    def __str__(self) -> str:
        return self.place_id

    class Meta:
        indexes = [
            models.Index(
                name="gmar_placeId_createdAt_idx",
                fields=["place_id", "created_at"]
            ),
        ]

