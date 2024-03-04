import type { TomorrowIoForecast } from "./tomorrow_io_forecast";

export type HookResponse = {
    loading: boolean,
    error: boolean,
    errorMessage: string,
    result: TomorrowIoForecast | undefined
};
