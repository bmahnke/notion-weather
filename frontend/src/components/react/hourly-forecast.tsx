import type { HourlyMapping } from "../../types/tomorrow_io_forecast"
import { IconComponent } from "./ui/icon-component"
import { getTimePart } from "../../helpers/date-time-helper"

interface HourlyForecastProps {
    hours: HourlyMapping[]
}

export function HourlyForecast(props: HourlyForecastProps) {

    return (
        <div className="flex flex-col">
            {props.hours.slice(0, 12).map((hour, index) => {
                return (
                    <div key={index} className="flex flex-row space-x-2">
                        <IconComponent icon={hour.values.weatherCodeInfo.icon} alt={hour.values.weatherCodeInfo.description} />  
                        <span>{getTimePart(hour.time, '12-hour')}</span>
                        <span>min: {hour.values.temperature}</span>
                
                        {hour.values.weatherCodeInfo && 
                            (
                                <>
                                    <span>Hour description: {hour.values.weatherCodeInfo.description}</span>
                                                                  
                                </>
                            )
                        }
                    </div>
                )
            })}
        </div>
    )
}
