import requests
import environ
from typing import Any
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action

from ..serializers import WeatherSerializer
from ..services import TomorrowIoRequestsBizLogic, GoogleCloud

class WeatherViewSet(viewsets.ViewSet):
    serializer_class = WeatherSerializer

    def __init__(self, **kwargs: Any) -> None:
        # reading .env file
        env = environ.Env()
        environ.Env.read_env()

        self.base_api_url = env('TOMORROW_IO_API_URL')
        self.api_key = env('TOMORROW_IO_API_KEY')
        self._googleClient = GoogleCloud()

        super().__init__(**kwargs)

    @action(detail=False, methods=['GET'], url_path='realtime', url_name='realtime')
    def realtime(self, request):
        place_id = str(request.GET.get('place_id', None))
        lat_long = str(request.GET.get('lat_long', None))

        if not place_id and not lat_long:
            return JsonResponse({"response": {}, "message": "ERROR - Bad Request. Must supply place id or lat long comobo."}, status=status.HTTP_400_BAD_REQUEST)

        if not place_id and not TomorrowIoRequestsBizLogic.location_str_is_lat_long(lat_long):
            return JsonResponse({"response": {}, "message": "ERROR - Bad Request. Must supply valid lat long comobo."}, status=status.HTTP_400_BAD_REQUEST)

        # FLOW:
        #   1. Client uses google map autocomplete to select location
        #       a. client gets place_id from autocomplete api
        #       b. client requests forecast/realtime from weather api via place_id
        #       c. server reverse geocodes the place_id to get lat/long combination
        #       d. server, once reverse geocoded, stores the request/result for the place
        #       e. server continues on and hits the weather api with the lat/long
        #       f. passes results back to the client
        # 
        #   2. Client uses browser location services
        #       a. client requests forecast/realtime from weather api with lat/long
        #       b. server reverse geocodes the lat/long to get a place_id (so we can cache)
        #       c. server, once reverse geocoded, stores the request/result for the place id
        #       d. server continues on and hits the weather api with the lat/long
        #       e. passes results AND place_id back to client

        if place_id:
            gmr = self._googleClient.geocode(place_id)
        else:
            gmr = self._googleClient.reverse_geocode(lat_long)

        # tomorrow.io prefers this way
        coords = str(gmr.location.y) + ", " + str(gmr.location.x)

        payload = { 
            "apikey": self.api_key,
            "location": coords,
            "units": request.GET.get('units', 'imperial')
        }

        previous = TomorrowIoRequestsBizLogic.check_cached_requests(gmr, payload)
        if previous.exists():
            return JsonResponse({ "response": previous[0].return_data, "place_id": gmr.place_id, "cached": True}, status=status.HTTP_200_OK)

        headers = {"content-type": "application/json"}
        response = requests.get(self.base_api_url + "realtime", headers=headers, params=payload)

        # log the request + response.
        TomorrowIoRequestsBizLogic.log_request(payload, response, gmr)

        # send it back
        return JsonResponse({ "response": response.json(), "place_id": gmr.place_id, "cached": False }, status=response.status_code)


    @action(detail=False, methods=['GET'], url_path='forecast', url_name='forecast')
    def forecast(self, request):
        place_id = str(request.GET.get('place_id', None))
        lat_long = str(request.GET.get('lat_long', None))

        if not place_id and not lat_long:
            return JsonResponse({"response": {}, "message": "ERROR - Bad Request. Must supply place id or lat long comobo."}, status=status.HTTP_400_BAD_REQUEST)

        if not place_id and not TomorrowIoRequestsBizLogic.location_str_is_lat_long(lat_long):
            return JsonResponse({"response": {}, "message": "ERROR - Bad Request. Must supply valid lat long comobo."}, status=status.HTTP_400_BAD_REQUEST)

        # FLOW:
        #   1. Client uses google map autocomplete to select location
        #       a. client gets place_id from autocomplete api
        #       b. client requests forecast/realtime from weather api via place_id
        #       c. server reverse geocodes the place_id to get lat/long combination
        #       d. server, once reverse geocoded, stores the request/result for the place
        #       e. server continues on and hits the weather api with the lat/long
        #       f. passes results back to the client
        # 
        #   2. Client uses browser location services
        #       a. client requests forecast/realtime from weather api with lat/long
        #       b. server reverse geocodes the lat/long to get a place_id (so we can cache)
        #       c. server, once reverse geocoded, stores the request/result for the place id
        #       d. server continues on and hits the weather api with the lat/long
        #       e. passes results AND place_id back to client

        if place_id:
            gmr = self._googleClient.geocode(place_id)
        else:
            gmr = self._googleClient.reverse_geocode(lat_long)

        # tomorrow.io prefers this way
        coords = str(gmr.location.y) + ", " + str(gmr.location.x)

        payload = { 
            "apikey": self.api_key,
            "location": coords,
            "units": request.GET.get('units', 'imperial'),
            "timesteps": request.GET.get('timesteps', 'daily')
        }

        previous = TomorrowIoRequestsBizLogic.check_cached_requests(gmr, payload)
        if previous.exists():
            return JsonResponse({ "response": previous[0].return_data, "place_id": gmr.place_id, "cached": True}, status=status.HTTP_200_OK)

        headers = {"content-type": "application/json"}
        response = requests.get(self.base_api_url + "forecast", headers=headers, params=payload)

        # log the request + response.
        TomorrowIoRequestsBizLogic.log_request(payload, response, gmr)

        # send it back
        return JsonResponse({ "response": response.json(), "place_id": gmr.place_id, "cached": False }, status=response.status_code)
