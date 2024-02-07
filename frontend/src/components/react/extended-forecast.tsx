import type { DailyMapping } from "../../types/tomorrow_io_forecast"
import { IconComponent } from "./ui/icon-component"
import { getDatePart } from "../../helpers/date-time-helper"

interface ExtendedForecastProps {
    days: DailyMapping[]
}

export function ExtendedForecast(props: ExtendedForecastProps) {

    return (
        <div className="flex flex-col">
            {props.days.map((day, index) => {
                return (
                    <div key={index} className="flex flex-row items-center space-x-2">
                        <IconComponent icon={day.values.weatherCodeInfo.icon} alt={day.values.weatherCodeInfo.description} />                                
                        <span>{getDatePart(day.time, 'short-day')}</span>
                        <span>min: {day.values.temperatureApparentMin}</span>
                        <span>max: {day.values.temperatureApparentMax}</span>
                    </div>
                )
            })}
        </div>
    )
}
