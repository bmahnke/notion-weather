import { IconComponent } from "./ui/icon-component"
import { getDatePart } from "../../helpers/date-time-helper"
import type { GooglePlace } from "../../types/google_place"
import { useRealtime } from "./hooks/useRealtime"

interface RealTimeForecastProps {
    googlePlace: GooglePlace
}

export function RealTimeForecast(props: RealTimeForecastProps) {
    const [realtime, loading] = useRealtime(props.googlePlace.place_id)

    return (
        <div className="flex flex-row space-x-2 items-center">
            { loading &&
                <span>LOADING</span>
            }
            { !loading && realtime &&
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
