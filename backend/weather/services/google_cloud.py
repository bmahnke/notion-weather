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
    def geocode(self, place_id: str) -> models.GoogleMapApiRequest:
        # check if we've requested this place id in the last year... if we have
        # use the cached result.
        one_year = datetime.now(timezone.utc) - timedelta(weeks=52)
        existing = models.GoogleMapApiRequest.objects.filter(
            place_id=place_id,
            created_at__gte=one_year
        )

        if existing.exists():
            return existing[0]
    
        result = self._gmaps.geocode(place_id=place_id)
        result = result[0]

        model = self._log_geocode_google_api_model(result)
        return model

    def reverse_geocode(self, latLongOrPlaceId: str) -> models.GoogleMapApiRequest:
        one_year = datetime.now(timezone.utc) - timedelta(weeks=52)
        existing = models.GoogleMapApiRequest.objects.filter(
            place_id=latLongOrPlaceId,
            created_at__gte=one_year
        )
        
        if existing.exists():
            return existing[0]
        
        result = self._gmaps.geocode(latLongOrPlaceId)

        breakpoint()
        result = result[0]

        model = self._log_geocode_google_api_model(result)
        return model
    
    def _log_geocode_address_model(self, data: dict) -> models.Address:

        street_number = self._get_address_piece(data, "street_number").get("long_name", None)
        route = self._get_address_piece(data, "route").get("long_name", None)

        atts = {
            "plus_code": self._get_address_piece(data, "plus_code").get("long_name", None),
            "compound_code": data.get("plus_code", {}).get("compound_code", None),
            "global_code": data.get("plus_code", {}).get("global_code", None),
            "address_1": street_number + " " + route if street_number and route else None,
            "city": self._get_address_piece(data, "locality").get("long_name", None),
            "county": self._get_address_piece(data, "administrative_area_level_2").get("long_name", None),
            "state": self._get_address_piece(data, "administrative_area_level_1").get("short_name", None),
            "country": self._get_address_piece(data, "country").get("short_name", None),
            "postal_code": self._get_address_piece(data, "postal_code").get("long_name", None),
            "formatted_address": data.get("formatted_address", None)
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
            "place_id": data["place_id"],
            "types": data["types"],
            "api_result": data,
            "address": self._log_geocode_address_model(data),
            "location_type": data.get("geometry", {}).get("location_type", None),
            "location": Point(data.get("geometry", {}).get("location", {}).get("lng", 0), data.get("geometry", {}).get("location", {}).get("lat", 0))
        }

        m = models.GoogleMapApiRequest(**googleApiModel)
        m.save()
        return m