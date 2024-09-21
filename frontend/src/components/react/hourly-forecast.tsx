import { IconComponent } from "./ui/icon-component"
import { getTimePart } from "../../helpers/date-time-helper"
import type { GooglePlace } from "../../types/google_place"
import { useForecast } from "./hooks/useForecast"

interface HourlyForecastProps {
    googlePlace: GooglePlace
}

export function HourlyForecast(props: HourlyForecastProps) {
    const hookResponse = useForecast(props.googlePlace.place_id, "hourly", true);

    return (
        <div className="flex flex-col">
            { hookResponse.loading &&
                <span>LOADING</span>
            }
            { !hookResponse.loading && hookResponse.error &&
                <span>ERROR: {hookResponse.errorMessage}</span>
            }            
            {!hookResponse.loading && hookResponse.result && hookResponse.result.response.timelines.hourly.slice(0, 12).map((hour, index) => {
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
