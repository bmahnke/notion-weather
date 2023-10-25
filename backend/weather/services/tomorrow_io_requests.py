import urllib.parse
import requests

from datetime import datetime, timedelta
from django.contrib.gis.geos import Point
from weather import models
from typing import List

class TomorrowIoRequestsBizLogic():
    @staticmethod
    def get_cached_result(params: dict) -> List[models.TomorrowIoRequest]: 
        p = { k : params[k] for k in params.keys() - ["apikey"] }
        encoded = urllib.parse.urlencode(p)

        one_day = datetime.now() - timedelta(days=1)

        return models.TomorrowIoRequest.objects.filter(requestedAt__gte=one_day, requestQuery=encoded)

    @staticmethod
    def log_request(params: dict, response: requests.Response) -> models.TomorrowIoRequest:
        p = { k : params[k] for k in params.keys() - ["apikey"] }
        encoded = urllib.parse.urlencode(p)

        location = None
        locationName = None
        locationType = None

        json_data = response.json()
        if response.status_code > 199 and response.status_code < 300:
            locationName = json_data["location"]["name"]
            locationType = json_data["location"]["type"]
            location = Point(json_data["location"]["lat"], json_data["location"]["lon"])

        return models.TomorrowIoRequest.objects.create(requestedAt=datetime.now(), requestQuery=encoded, returnData=json_data, location=location, locationName=locationName, locationType=locationType)
            