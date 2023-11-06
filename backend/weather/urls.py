from django.urls import path, include
from rest_framework import routers
from . import views
 
# create a router object
router = routers.DefaultRouter()
 
# register the router
router.register(r'weather', views.weather.WeatherViewSet, 'weather')

urlpatterns = [
    path('', include(router.urls))
]