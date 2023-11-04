import urllib.parse
import requests
from datetime import datetime, timedelta, timezone
from django.contrib.gis.geos import Point
from weather import models
from typing import List

import pdb

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
        # if location has a comma and is not numeric (i.e. "evans, ga" vs "32.33, -82.332")
        # take the front of the split and use that
        if location_str.find(',') > 0:
            try:
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
        p = { k : params[k] for k in params.keys() - ["apikey"] }

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
            units=p.get("units", None),
            locationQuery=p.get("location", None),
            timesteps=p.get("timesteps", None),
            returnData=json_data,
            location=location,
            locationName=locationName,
            locationType=locationType)
            