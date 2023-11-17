import googlemaps
import environ

from typing import Any
from datetime import datetime, timezone, timedelta
from weather import models
from django.contrib.gis.geos import Point

import pdb

class GoogleCloud():
    def __init__(self, **kwargs: Any) -> None:
        # reading .env file
        env = environ.Env()
        environ.Env.read_env()

        self._API_KEY = env('GOOGLE_API_KEY')
        self._gmaps = googlemaps.Client(key=self._API_KEY)

        super().__init__(**kwargs)        

    # places_autocomplete(input_text, session_token=None, offset=None, origin=None, location=None, radius=None, language=None, types=None, components=None, strict_bounds=False)
    def places_autocomplete(self, input_text: str):
        return self._gmaps.places_autocomplete(input_text)
    
    # geocode(address=None, place_id=None, components=None, bounds=None, region=None, language=None)
    def geocode(self, place_id: str):
        # check if we've requested this place id in the last year... if we have
        # use the cached result.
        one_day = datetime.now(timezone.utc) - timedelta(weeks=52)
        existing = models.GoogleMapApiRequest.objects.filter(
            placeId=place_id,
            createdAt__gte=one_day
        )

        if existing.exists():
            return existing[0]
    
        result = self._gmaps.geocode(place_id=place_id)
        result = result[0]

        self._log_geocode_google_api_model(result)

        return result

    def reverse_geocode(self, latLongOrPlaceId: str):
        one_day = datetime.now(timezone.utc) - timedelta(weeks=52)
        existing = models.GoogleMapApiRequest.objects.filter(
            placeId=latLongOrPlaceId,
            createdAt__gte=one_day
        )
        
        if existing.exists():
            return existing[0]
        
        result = self._gmaps.reverse_geocode(latLongOrPlaceId)
        result = result[0]

        self._log_geocode_google_api_model(result)

        return result    
    
    def _log_geocode_address_model(self, data: dict) -> models.Address:

        street_number = self.get_address_piece(data, "street_number").get("long_name", None)
        route = self.get_address_piece(data, "route").get("long_name", None)

        atts = {
            "address1": street_number + " " + route if street_number and route else None,
            "city": self._get_address_piece(data, "locality").get("long_name", None),
            "county": self._get_address_piece(data, "administrative_area_level_2").get("long_name", None),
            "state": self._get_address_piece(data, "administrative_area_level_1").get("short_name", None),
            "country": self._get_address_piece(data, "country").get("short_name", None),
            "postalCode": self._get_address_piece(data, "postal_code").get("long_name", None),
            "formattedAddress": data.get("formatted_address", None)
        }

        address = models.Address(**atts)
        address.save()
        return address
    
    def _get_address_piece(self, data: dict, address_type: str) -> dict:
        for address_component in data.get("address_components", {}):
            if address_type in address_component.get("types", []):
                return address_component
        
        # default return
        return {}

    def _log_geocode_google_api_model(self, data: dict) -> models.GoogleMapApiRequest:
        googleApiModel = {
            "placeId": data["place_id"],
            "types": data["types"],
            "apiResult": data,
            "address": self._log_geocode_address_model(data),
            "locationType": data.get("geometry", {}).get("location_type", None),
            "location": Point(data.get("geometry", {}).get("lng", 0), data.get("geometry", {}).get("lat", 0))
        }

        m = models.GoogleMapApiRequest(**googleApiModel)
        m.save()
        return m