import type { DailyMapping } from "../../types/tomorrow_io_forecast"

interface DayWeatherProps {
    key: number
    day: DailyMapping
}

export function DayWeather(props: DayWeatherProps) {

    return (
        <div key={props.key} className="flex flex-col space-y-2">
        <span>{props.day.time}</span>
        <span>min: {props.day.values.temperatureApparentMin}</span>
        <span>max: {props.day.values.temperatureApparentMax}</span>

        {props.day.values.weatherCodeInfo && 
            (
                <span>Day description: {props.day.values.weatherCodeInfo.description}</span>
            )
        }
    </div>
    )
}
