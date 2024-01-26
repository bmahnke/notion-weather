import type { DailyMapping } from "../../types/tomorrow_io_forecast"
import { DayWeather } from "./day-weather"

interface ForecastProps {
    days: DailyMapping[]
}

export function Forecast(props: ForecastProps) {

    return (
        <div className="flex flex-col">
            {props.days.map((day, index) => {
                return (
                    <DayWeather
                        key={index}
                        day={day}
                    />
                )
            })}
        </div>
    )
}
