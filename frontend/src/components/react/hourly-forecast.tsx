import type { TomorrowIoForecast } from "../../types/tomorrow_io_forecast"
import { IconComponent } from "./ui/icon-component"
import { getTimePart } from "../../helpers/date-time-helper"
import { useEffect, useState } from "react"
import { fetchApiUrl } from "../../helpers/api"
import type { GooglePlace } from "../../types/google_place"

interface HourlyForecastProps {
    googlePlace: GooglePlace
}

export function HourlyForecast(props: HourlyForecastProps) {
    const [forecast, setForecast] = useState<TomorrowIoForecast | undefined>(undefined)

    useEffect(() => {
        const url = new URL("http://127.0.0.1:8000/api/weather/forecast");
        url.searchParams.set("place_id", props.googlePlace.place_id);
        url.searchParams.set("timesteps", "hourly")
    
        fetchApiUrl(url.toString(), { method: "GET" })
            .then(e => {
                if (e) setForecast(e)
            })
    }, [])

    return (
        <div className="flex flex-col">
            {forecast && forecast.response.timelines.hourly.slice(0, 12).map((hour, index) => {
                return (
                    <div key={index} className="flex flex-row space-x-2">
                        <IconComponent className="w-8 h-8" icon={hour.values.weatherCodeInfo.icon} alt={hour.values.weatherCodeInfo.description} />  
                        <span className="text-lg">{getTimePart(hour.time, '12-hour')}</span>
                        <span>min: {hour.values.temperature}</span>
                
                        {hour.values.weatherCodeInfo && 
                            (
                                <span>Hour description: {hour.values.weatherCodeInfo.description}</span>
                            )
                        }
                    </div>
                )
            })}
        </div>
    )
}
