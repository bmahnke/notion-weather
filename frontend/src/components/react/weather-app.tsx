import SearchForm from "./search-form";
import { useState, useEffect } from "react";
import { type GooglePlace } from "../../types/google_place";
import { ExtendedForecast } from "./extended-forecast";
import { HourlyForecast } from "./hourly-forecast";
import { RealTimeForecast } from "./realtime-forecast";

export function WeatherApp() {
    const [googlePlace, setGooglePlace] = useState<GooglePlace | undefined>(undefined)

    function handlePlaceSelect(option: GooglePlace | undefined) {
        setGooglePlace(option)
    }

    if (true) {
        useEffect(() => {
            const googlePlaceOpt = {
                place_id: "ChIJZRJWylm-locRud7VH5uFOmM",
                description: "Lincoln, NE"
            } as GooglePlace
        
            setGooglePlace(googlePlaceOpt)
        }, [])
    }

    return (
        <div>
            <SearchForm 
                onPlaceSelect={handlePlaceSelect}
            />

            { googlePlace &&
                <>
                    <RealTimeForecast googlePlace={googlePlace} />
                    <div className="grid grid-cols-2">
                        <ExtendedForecast googlePlace={googlePlace} />
                        <HourlyForecast googlePlace={googlePlace} />
                    </div>
                </>
            }
        </div>
    )
}

export default WeatherApp;