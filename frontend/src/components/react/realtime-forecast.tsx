import { IconComponent } from "./ui/icon-component"
import { getDatePart } from "../../helpers/date-time-helper"
import type { GooglePlace } from "../../types/google_place"
import { useRealtime } from "./hooks/useRealtime"

interface RealTimeForecastProps {
    googlePlace: GooglePlace
}

export function RealTimeForecast(props: RealTimeForecastProps) {
    const hookResponse = useRealtime(props.googlePlace.place_id)

    return (
        <div className="flex flex-row space-x-2 items-center">
            { hookResponse.loading &&
                <span>LOADING</span>
            }
            { !hookResponse.loading && hookResponse.error &&
                <span>ERROR: {hookResponse.errorMessage}</span>
            }
            { !hookResponse.loading && hookResponse.result &&
                <>
                    <IconComponent className="w-8 h-8" icon={hookResponse.result.response.data.values.weatherCodeInfo.icon} alt={hookResponse.result.response.data.values.weatherCodeInfo.description} />
                    <span className="text-lg">{getDatePart(hookResponse.result.response.data.time, 'short-day')}</span>
                    <span>temp: {hookResponse.result.response.data.values.temperature}</span>
                    <span>feels like: {hookResponse.result.response.data.values.temperatureApparent}</span>
                </>
            }
        </div>
    )
}
