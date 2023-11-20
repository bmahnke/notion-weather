from typing import Any
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action

from ..services import GoogleCloud
from ..models import GoogleMapApiRequest

import pdb

class PlacesViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs: Any) -> None:
        self._googleClient = GoogleCloud()

        super().__init__(**kwargs)

    @action(detail=False, methods=['GET'], url_path='autocomplete', url_name='autocomplete')
    def autocomplete(self, request):
        place_query = str(request.GET.get('place_query', 'evans, ga'))

        try:
            autocomplete_results = self._googleClient.places_autocomplete(place_query)
            return JsonResponse({ "response": "success", "detail": autocomplete_results }, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({ "response": "error", "message": repr(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['GET'], url_path='geocode', url_name='geocode')
    def geocode(self, request):
        place_id = str(request.GET.get('place_id', 'evans, ga'))

        try:
            res = self._googleClient.geocode(place_id)

            return JsonResponse({ "response": "success", "datetime": res.created_at, "detail": res.api_result }, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({ "response": "error", "message": repr(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['GET'], url_path='reverse-geocode', url_name='reverse_geocode')
    def reverse_geocode(self, request):
        place_id = str(request.GET.get('place_id', '0, 0'))
        
        try:
            res = self._googleClient.reverse_geocode(place_id)

            return JsonResponse({ "response": "success", "datetime": res.created_at, "detail": res.api_result }, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({ "response": "error", "message": repr(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        