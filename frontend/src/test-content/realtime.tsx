const realtime_data = {
    "response": {
        "data": {
            "time": "2024-09-06T15:19:00Z",
            "values": {
                "uvIndex": 2,
                "dewPoint": 51.13,
                "humidity": 59,
                "windGust": 12.58,
                "cloudBase": null,
                "windSpeed": 5.31,
                "cloudCover": 3,
                "visibility": 9.94,
                "temperature": 65.86,
                "weatherCode": 1000,
                "cloudCeiling": null,
                "rainIntensity": 0,
                "snowIntensity": 0,
                "windDirection": 2.38,
                "sleetIntensity": 0,
                "uvHealthConcern": 1,
                "temperatureApparent": 65.86,
                "pressureSurfaceLevel": 29.05,
                "freezingRainIntensity": 0,
                "precipitationProbability": 0,
                "weatherCodeInfo": {
                    "code": 1000,
                    "description": "Clear, Sunny",
                    "icon": "sun"
                }
            }
        },
        "location": {
            "lat": 40.8136634,
            "lon": -96.7025764
        }
    },
    "place_id": "ChIJZRJWylm-locRud7VH5uFOmM",
    "cached": true
}

export function getRealtimeTestData() : any { return realtime_data };