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
            requested_at__gte=one_day, 
            units=params.get("units"), 
            location_query=params.get("location"), 
            timesteps=params.get("timesteps")
        )

    @staticmethod
    def check_cached_requests(gmr: models.GoogleMapApiRequest, params: dict) -> List[models.TomorrowIoRequest]:
        one_day = datetime.now(timezone.utc) - timedelta(days=1)
        return models.TomorrowIoRequest.objects.filter(
            requested_at__gte=one_day, 
            units=params.get("units"), 
            google_map_request_id=gmr.id,
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
    def log_request(params: dict, response: requests.Response, google_map_request: models.GoogleMapApiRequest) -> models.TomorrowIoRequest:
        # only log successful responses.
        if response.status_code != requests.codes.ok:
            return None
        
        json_data = response.json()

        return models.TomorrowIoRequest.objects.create(
            requested_at=datetime.now(timezone.utc),
            units=params.get("units", None),
            google_map_request=google_map_request,
            location_query=params.get("location", None),
            timesteps=params.get("timesteps", None),
            return_data=json_data)
            