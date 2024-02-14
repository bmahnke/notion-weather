import { type TomorrowIoForecast } from "../types/tomorrow_io_forecast";
import { getWeatherCodeInformation } from "../types/weather_code";

export const weatherFetch = <T>(
    request: RequestInfo,
    requestInit?: RequestInit
): Promise<T> => {
    return new Promise(resolve => {
        fetch(request, requestInit)
            .then(response => response.json())
            .then(body => resolve(body));
    })
}

// Todo: This should move to the server
function setWeatherCodeInfo(io: TomorrowIoForecast) : TomorrowIoForecast {
    if (io.response.timelines) {
        if (io.response.timelines.daily) {
            io.response.timelines.daily.forEach(v => {
                console.debug("setting weather code information for day: ", v.time)
                v.values.weatherCodeInfo = getWeatherCodeInformation(v.values.weatherCodeMin)
            });
        } else if (io.response.timelines.hourly) {
            io.response.timelines.hourly.forEach(v => {
                console.debug("setting weather code information for day: ", v.time)
                v.values.weatherCodeInfo = getWeatherCodeInformation(v.values.weatherCode)
            });        
        }        
    } else if (io.response.data) {
        io.response.data.values.weatherCodeInfo = getWeatherCodeInformation(io.response.data.values.weatherCode)        
    }

    return io;
}

export const fetchApiUrl = (url: string, params: object) : Promise<void | TomorrowIoForecast> => {
    return weatherFetch<TomorrowIoForecast>(url, params)
        .then(res => setWeatherCodeInfo(res))
        .catch(error => {
            console.error("ERROR", error);
        });
}

