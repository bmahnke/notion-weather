import { IconComponent } from "./ui/icon-component"
import { getDatePart } from "../../helpers/date-time-helper"
import type { GooglePlace } from "../../types/google_place"
import { useForecast } from "./hooks/useForecast"

interface ExtendedForecastProps {
    googlePlace: GooglePlace
}

export function ExtendedForecast(props: ExtendedForecastProps) {
    const hookResponse = useForecast(props.googlePlace.place_id, "daily", true);

    return (
        <div className="flex flex-col">
            {hookResponse.loading && 
                <span>LOADING</span>
            }
            { !hookResponse.loading && hookResponse.error &&
                <span>ERROR: {hookResponse.errorMessage}</span>
            }            
            {!hookResponse.loading && hookResponse.result && hookResponse.result.response.timelines.daily.slice(1).map((day, index) => {
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
