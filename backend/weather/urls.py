from django.urls import path, include
from rest_framework import routers
from . import views
 
# create a router object
router = routers.DefaultRouter()
 
# register the router
router.register(r'weather', views.weather.WeatherViewSet, 'weather')
router.register(r'places', views.places.PlacesViewSet, 'places')

urlpatterns = [
    path('', include(router.urls)),
]