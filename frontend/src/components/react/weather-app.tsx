import SearchForm from "./search-form";
import { type GooglePlace } from "../../types/googlePlace";
import { useEffect, useState } from "react";
import { type TomorrowIoForecast } from "../../types/tomorrow_io_forecast";

import { type ApiResponse } from '../../types/api_response';
import { weatherFetch } from '../../helpers/api';
import { getWeatherCodeInformation } from "../../types/weather_code";

export function WeatherApp() {
    const [googlePlace, setGooglePlace] = useState<GooglePlace | undefined>(undefined)
    const [forecast, setForecast] = useState<TomorrowIoForecast | undefined>(undefined)

    function handlePlaceSelect(option: GooglePlace | undefined) {
        setGooglePlace(option)
    }

    useEffect(() => {
        if (googlePlace) {

            let url = new URL("http://127.0.0.1:8000/api/weather/forecast");
            
            //@ts-ignore
            url.searchParams.set("place_id", googlePlace.place_id);
            
            const promise = weatherFetch<ApiResponse<TomorrowIoForecast>>(url.toString(), {
                method: "GET"
            }).catch((e) => {
                console.error("error", e)
            })

            promise.then(e => {
                //@ts-ignore
                (e as TomorrowIoForecast).response.timelines.daily.forEach(day => {
                    console.debug("setting weather code information for day: ", day.time)
                    day.values.weatherCodeInfo = getWeatherCodeInformation(day.values.weatherCodeMin)
                })

                //@ts-ignore
                setForecast(e)
            })
        }
    }, [googlePlace])
    
    return (
        <div>
            <SearchForm 
                onPlaceSelect={handlePlaceSelect}
            />

            { googlePlace &&
                <div>
                    <span>
                        {googlePlace.description} was selected!
                    </span>
                    <p>
                        Place_ID: {googlePlace.place_id}
                    </p>                
                </div>
            }

            { forecast &&
                <div className="flex flex-col">
                    {forecast.response.timelines.daily.map((day, index) => {
                        return (
                            <div key={index} className="flex flex-col space-y-2">
                                <span>{day.time}</span>
                                <span>min: {day.values.temperatureApparentMin}</span>
                                <span>max: {day.values.temperatureApparentMax}</span>

                                {day.values.weatherCodeInfo && 
                                    (
                                        <span>Day description: {day.values.weatherCodeInfo.description}</span>
                                    )
                                }
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default WeatherApp;