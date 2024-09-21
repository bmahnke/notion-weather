interface WeatherStatProps {
    name: string,
    value: any
}

export function WeatherStat(props: WeatherStatProps) {

    return (
        <div className="flex flex-col space-y-2">
            <span>{props.name}</span>
            <span>{props.value}</span>
        </div>
    )
}