import { IconComponent } from "./ui/icon-component"
import { getDatePart } from "../../helpers/date-time-helper"
import type { GooglePlace } from "../../types/google_place"
import { useRealtime } from "./hooks/useRealtime"
import { WeatherStat } from "./ui/weather-stat"

interface RealTimeForecastProps {
    googlePlace: GooglePlace
}

export function RealTimeForecast(props: RealTimeForecastProps) {
    const hookResponse = useRealtime(props.googlePlace.place_id, true)

    const availableStats = ['humidity', 'windDirection', 'windGust', 'visibility', 'precipitationProbability', 'windSpeed', 'temperatureApparent']

    return (
        <div className="flex flex-row space-x-2 items-center">
            { hookResponse.loading &&
                <span>LOADING</span>
            }
            { !hookResponse.loading && hookResponse.error &&
                <span>ERROR: {hookResponse.errorMessage}</span>
            }
            { !hookResponse.loading && hookResponse.result &&
                <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                        <IconComponent className="w-8 h-8" icon={hookResponse.result.response.data.values.weatherCodeInfo.icon} alt={hookResponse.result.response.data.values.weatherCodeInfo.description} />
                        <span className="text-lg">{getDatePart(hookResponse.result.response.data.time, 'short-day')}</span>
                        <span>temp: {hookResponse.result.response.data.values.temperature}</span>
                        {/*<span>feels like: {hookResponse.result.response.data.values.temperatureApparent}</span> */}
                    </div>

                    <div className="w-full grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {availableStats.map(stat => {
                              //@ts-ignore
                            return <WeatherStat name={stat} value={hookResponse.result.response.data.values[stat]} />
                        })}
                    </div>
                </div>
            }
        </div>
    )
}
