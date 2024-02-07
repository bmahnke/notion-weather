import SearchForm from "./search-form";
import { useEffect, useState } from "react";
import { weatherFetch } from '../../helpers/api';
import { getWeatherCodeInformation } from "../../types/weather_code";

import { type GooglePlace } from "../../types/google_place";
import { type TomorrowIoForecast } from "../../types/tomorrow_io_forecast";
import { type ApiResponse } from '../../types/api_response';
import { ExtendedForecast } from "./extended-forecast";
import { HourlyForecast } from "./hourly-forecast";
import { IconComponent } from "./ui/icon-component";
import { getDatePart } from "../../helpers/date-time-helper"

export function WeatherApp() {
    const [googlePlace, setGooglePlace] = useState<GooglePlace | undefined>(undefined)
    const [forecast, setForecast] = useState<TomorrowIoForecast | undefined>(undefined)
    const [hourly, setHourly] = useState<TomorrowIoForecast | undefined>(undefined)
    const [realtime, setRealtime] = useState<TomorrowIoForecast | undefined>(undefined)

    function handlePlaceSelect(option: GooglePlace | undefined) {
        setGooglePlace(option)
    }

    useEffect(() => {
        if (googlePlace) {

            let url = new URL("http://127.0.0.1:8000/api/weather/forecast");
            
            //@ts-ignore
            url.searchParams.set("place_id", googlePlace.place_id);
            
            const dailyPromise = weatherFetch<ApiResponse<TomorrowIoForecast>>(url.toString(), {
                method: "GET"
            }).catch((e) => {
                console.error("error", e)
            })

            dailyPromise.then(e => {
                //@ts-ignore
                (e as TomorrowIoForecast).response.timelines.daily.forEach(day => {
                    console.debug("setting weather code information for day: ", day.time)
                    day.values.weatherCodeInfo = getWeatherCodeInformation(day.values.weatherCodeMin)
                })

                //@ts-ignore
                setForecast(e)
            });

            url.searchParams.set("timesteps", "hourly")
            const hourlyPromise = weatherFetch<ApiResponse<TomorrowIoForecast>>(url.toString(), {
                method: "GET"
            }).catch((e) => {
                console.error("Error", e)
            })

            hourlyPromise.then(e => {
                //@ts-ignore
                (e as TomorrowIoForecast).response.timelines.hourly.forEach(hour => {
                    hour.values.weatherCodeInfo = getWeatherCodeInformation(hour.values.weatherCode)
                })

                //@ts-ignore
                setHourly(e)
            })

            let realTimeUrl = new URL("http://127.0.0.1:8000/api/weather/realtime");
            //@ts-ignore
            realTimeUrl.searchParams.set("place_id", googlePlace.place_id);

            const realtimePromise = weatherFetch<ApiResponse<TomorrowIoForecast>>(realTimeUrl.toString(), {
                method: "GET"
            }).catch((e) => {
                console.error("Error", e)
            })

            realtimePromise.then(e => {
                //@ts-ignore
                (e as TomorrowIoForecast).response.data.values.weatherCodeInfo = getWeatherCodeInformation(e.response.data.values.weatherCode)

                //@ts-ignore
                setRealtime(e)
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
            <div className="flex space-x-2">
                { realtime &&
                    <>
                        <IconComponent icon={realtime.response.data.values.weatherCodeInfo.icon} alt={realtime.response.data.values.weatherCodeInfo.description} />
                        <span>{getDatePart(realtime.response.data.time, 'short-day')}</span>
                        <span>temp: {realtime.response.data.values.temperature}</span>
                        <span>feels like: {realtime.response.data.values.temperatureApparent}</span>
                    </>
                }
            </div>
            <div className="grid grid-cols-2">
                { forecast &&
                    <ExtendedForecast
                        days={forecast.response.timelines.daily.slice(1)}
                    />
                }
                { hourly &&
                    <HourlyForecast
                        hours={hourly.response.timelines.hourly}
                    />
                }
            </div>
        </div>
    )
}

export default WeatherApp;