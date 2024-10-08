import { useEffect, useState } from "react";
import type { TomorrowIoForecast } from "../../../types/tomorrow_io_forecast";
import { fetchApiUrl } from "../../../helpers/api";
import type { HookResponse } from "../../../types/hook_response";
import { getRealtimeTestData } from "../../../test-content/realtime";

export function useRealtime(googlePlaceId: string, test_data: boolean = false) : HookResponse {
    const [realtime, setRealtime] = useState<TomorrowIoForecast | undefined>(undefined)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMEssage] = useState("")

    function reset() {
        setRealtime(undefined)
        setLoading(true)
        setError(false)
        setMEssage("")
    }

    useEffect(() => {
        reset()

        const realTimeUrl = new URL("http://127.0.0.1:8000/api/weather/realtime");
        realTimeUrl.searchParams.set("place_id", googlePlaceId);

        if (test_data) {
            setRealtime(getRealtimeTestData())
            setLoading(false)
        } else {
            fetchApiUrl(realTimeUrl.toString(), { method: "GET" })
                .then(e => {
                    console.debug("FFETCH REALTIME", e);
                    if (e) setRealtime(e)
                })
                .catch((error : Error) => {
                    console.error("ERROR", error);
                    setError(true);
                    setMEssage(error.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        }

    }, [googlePlaceId]);

    return {
        loading: loading,
        error: error,
        errorMessage: message,
        result: realtime
    };
}