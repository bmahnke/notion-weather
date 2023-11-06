import requests
import pdb

from datetime import datetime, timedelta, timezone
from django.contrib.gis.geos import Point
from typing import List
from weather import models

class TomorrowIoRequestsBizLogic():
    @staticmethod
    def get_cached_result(params: dict) -> List[models.TomorrowIoRequest]: 
        one_day = datetime.now(timezone.utc) - timedelta(days=1)
        return models.TomorrowIoRequest.objects.filter(
            requestedAt__gte=one_day, 
            units=params.get("units"), 
            locationQuery=params.get("location"), 
            timesteps=params.get("timesteps")
        )

    @staticmethod
    def location_str_is_lat_long(location_str: str):
        # if we don't have a comma in the location string, we're not a
        # a valid lat/long combination, so return false
        if location_str.find(',') > 0:
            try:
                # if we can parse the left and right as floats,
                # then we should be a lat/long combo.

                left, right = location_str.split(',')
                float(left)
                float(right[1:None])
                return True
            except ValueError:
                return False
        else:
            return False

    @staticmethod
    def log_request(params: dict, response: requests.Response) -> models.TomorrowIoRequest:
        location = None
        locationName = None
        locationType = None

        json_data = response.json()
        if response.status_code > 199 and response.status_code < 300:
            locationName = json_data.get('location').get('name', None)
            locationType = json_data.get('location').get('type', None)
            location = Point(json_data["location"]["lon"], json_data["location"]["lat"])

        return models.TomorrowIoRequest.objects.create(
            requestedAt=datetime.now(timezone.utc),
            units=params.get("units", None),
            locationQuery=params.get("location", None),
            timesteps=params.get("timesteps", None),
            returnData=json_data,
            location=location,
            locationName=locationName,
            locationType=locationType)
            