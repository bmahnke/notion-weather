import { useEffect, useState } from "react";
import type { TomorrowIoForecast } from "../../../types/tomorrow_io_forecast";
import { fetchApiUrl } from "../../../helpers/api";

export function useRealtime(googlePlaceId: string) : [TomorrowIoForecast | undefined, boolean] {
    const [realtime, setRealtime] = useState<TomorrowIoForecast | undefined>(undefined)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const realTimeUrl = new URL("http://127.0.0.1:8000/api/weather/realtime");
        realTimeUrl.searchParams.set("place_id", googlePlaceId);
        fetchApiUrl(realTimeUrl.toString(), { method: "GET" })
            .then(e => {
                console.debug("FFETCH REALTIME", e);
                if (e) setRealtime(e)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [googlePlaceId]);

    return [realtime, loading];
}