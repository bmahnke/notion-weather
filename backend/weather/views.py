import requests
import environ

from typing import Any

from django.shortcuts import render
from django.http import JsonResponse

from rest_framework import viewsets
from rest_framework.decorators import action

from .serializers import WeatherSerializer

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
    def forcast(self, request):
        payload = { 
            "apikey": self.api_key,
            "location": request.GET.get('location', 'new york'),
            "units": request.GET.get('units', 'imperial'),
            "timesteps": request.GET.get('timesteps', 'daily')
        }

        headers = {"content-type": "application/json"}

        response = requests.get(self.base_api_url + "forecast", headers=headers, params=payload)
        print("tomorrow.io response: " + str(response.status_code))
        print("response headers: ")
        print(response.headers)

        return JsonResponse({ "response": response.json() }, status=response.status_code)

    @action(detail=False, methods=['GET'], url_path='realtime', url_name='realtime')
    def realtime(self, request):
        payload = { 
            "apikey": self.api_key,
            "location": request.GET.get('location', 'new york'),
            "units": request.GET.get('units', 'imperial'),
        }

        headers = {"content-type": "application/json"}

        response = requests.get(self.base_api_url + "realtime", headers=headers, params=payload)
        print("tomorrow.io response: " + str(response.status_code))
        print("response headers: ")
        print(response.headers)
        
        return JsonResponse({ "response": response.json() }, status=response.status_code)        