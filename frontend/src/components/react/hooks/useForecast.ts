import { useEffect, useState } from "react";
import type { TomorrowIoForecast } from "../../../types/tomorrow_io_forecast";
import { fetchApiUrl } from "../../../helpers/api";

export function useForecast(googlePlaceId: string, timesteps: string) : [TomorrowIoForecast | undefined, boolean] {
    const [forecast, setForecast] = useState<TomorrowIoForecast | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const forecastUrl = new URL("http://127.0.0.1:8000/api/weather/forecast");
        forecastUrl.searchParams.set("place_id", googlePlaceId);
        forecastUrl.searchParams.set("timesteps", timesteps);

        fetchApiUrl(forecastUrl.toString(), { method: "GET" })
            .then(e => {
                console.debug("FFETCH FORECAST", e);
                if (e) setForecast(e)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [googlePlaceId]);

    return [forecast, loading];
}