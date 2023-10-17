from rest_framework import serializers

class WeatherSerializer(serializers.Serializer):
    json_data = serializers.JSONField()