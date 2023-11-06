import requests
import environ
from typing import Any
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action

from ..serializers import WeatherSerializer
from ..services import TomorrowIoRequestsBizLogic

class WeatherViewSet(viewsets.ViewSet):
    serializer_class = WeatherSerializer

    def __init__(self, **kwargs: Any) -> None:
        # reading .env file
        env = environ.Env()
        environ.Env.read_env()

        self.base_api_url = env('TOMORROW_IO_API_URL')
        self.api_key = env('TOMORROW_IO_API_KEY')

        super().__init__(**kwargs)

    @action(detail=False, methods=['GET'], url_path='forecast', url_name='forecast')
    def forecast(self, request):
        loc = str(request.GET.get('location', 'new york'))

        is_lat_long = TomorrowIoRequestsBizLogic.location_str_is_lat_long(loc)

        # if location has a comma and is not numeric (i.e. "evans, ga" vs "32.33, -82.332")
        # take the front of the split and use that
        if not is_lat_long:
            loc = loc.split(',')[0]          

        payload = { 
            "apikey": self.api_key,
            "location": loc,
            "units": request.GET.get('units', 'imperial'),
            "timesteps": request.GET.get('timesteps', 'daily')
        }

        cached = TomorrowIoRequestsBizLogic.get_cached_result(payload)
        if cached.exists():
            return JsonResponse({ "response": cached[0].returnData, "cached": True}, status=status.HTTP_200_OK)

        headers = {"content-type": "application/json"}
        response = requests.get(self.base_api_url + "forecast", headers=headers, params=payload)

        TomorrowIoRequestsBizLogic.log_request(payload, response)
        return JsonResponse({ "response": response.json() }, status=response.status_code)

    @action(detail=False, methods=['GET'], url_path='realtime', url_name='realtime')
    def realtime(self, request):
        loc = str(request.GET.get('location', 'new york'))

        is_lat_long = TomorrowIoRequestsBizLogic.location_str_is_lat_long(loc)

        # if location has a comma and is not numeric (i.e. "evans, ga" vs "32.33, -82.332")
        # take the front of the split and use that
        if not is_lat_long:
            loc = loc.split(',')[0]

        payload = { 
            "apikey": self.api_key,
            "location": loc,
            "units": request.GET.get('units', 'imperial'),
        }

        cached = TomorrowIoRequestsBizLogic.get_cached_result(payload)
        if cached.exists():
            return JsonResponse({ "response": cached[0].returnData, "cached": True}, status=status.HTTP_200_OK)

        headers = {"content-type": "application/json"}
        response = requests.get(self.base_api_url + "realtime", headers=headers, params=payload)
        
        TomorrowIoRequestsBizLogic.log_request(payload, response)
        return JsonResponse({ "response": response.json() }, status=response.status_code)
