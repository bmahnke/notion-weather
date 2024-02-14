import type { TomorrowIoForecast } from "../../types/tomorrow_io_forecast"
import { IconComponent } from "./ui/icon-component"
import { getDatePart } from "../../helpers/date-time-helper"
import { useEffect, useState } from "react"
import { fetchApiUrl } from "../../helpers/api"
import type { GooglePlace } from "../../types/google_place"

interface ExtendedForecastProps {
    googlePlace: GooglePlace
}

export function ExtendedForecast(props: ExtendedForecastProps) {
    const [forecast, setForecast] = useState<TomorrowIoForecast | undefined>(undefined)

    useEffect(() => {
        const url = new URL("http://127.0.0.1:8000/api/weather/forecast");
        url.searchParams.set("place_id", props.googlePlace.place_id);
    
        fetchApiUrl(url.toString(), { method: "GET" })
            .then(e => {
                if (e) setForecast(e)
            })
    }, [])

    return (
        <div className="flex flex-col">
            {forecast && forecast.response.timelines.daily.slice(1).map((day, index) => {
                return (
                    <div key={index} className="flex flex-row items-center space-x-2">
                        <IconComponent className="w-8 h-8" icon={day.values.weatherCodeInfo.icon} alt={day.values.weatherCodeInfo.description} />                                
                        <span className="text-lg">{getDatePart(day.time, 'short-day')}</span>
                        <span>min: {day.values.temperatureApparentMin}</span>
                        <span>max: {day.values.temperatureApparentMax}</span>
                    </div>
                )
            })}
        </div>
    )
}
