import type { TomorrowIoForecast } from "../../types/tomorrow_io_forecast"
import { IconComponent } from "./ui/icon-component"
import { getDatePart } from "../../helpers/date-time-helper"
import { useEffect, useState } from "react"
import { fetchApiUrl } from "../../helpers/api"
import type { GooglePlace } from "../../types/google_place"

interface RealTimeForecastProps {
    googlePlace: GooglePlace
}

export function RealTimeForecast(props: RealTimeForecastProps) {
    const [realtime, setRealtime] = useState<TomorrowIoForecast | undefined>(undefined)

    useEffect(() => {
        const realTimeUrl = new URL("http://127.0.0.1:8000/api/weather/realtime");
        realTimeUrl.searchParams.set("place_id", props.googlePlace.place_id);
        fetchApiUrl(realTimeUrl.toString(), { method: "GET" })
            .then(e => {
                if (e) setRealtime(e)
            })       
    }, [])

    return (
        <div className="flex flex-row space-x-2 items-center">
            { realtime &&
                <>
                    <IconComponent className="w-8 h-8" icon={realtime.response.data.values.weatherCodeInfo.icon} alt={realtime.response.data.values.weatherCodeInfo.description} />
                    <span className="text-lg">{getDatePart(realtime.response.data.time, 'short-day')}</span>
                    <span>temp: {realtime.response.data.values.temperature}</span>
                    <span>feels like: {realtime.response.data.values.temperatureApparent}</span>
                </>
            }
        </div>
    )
}
