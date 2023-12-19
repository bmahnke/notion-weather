type WeatherCodeInformation = {
    code: number,
    description: string,
    icon: string
};

type CodeMapping = {
    [key: number]: string
}

const IconMap: CodeMapping = {        
    0: "Unknown",
    1000: "sun",
    1100: "sun",
    1101: "cloud-sun",
    1102: "cloud-sun",
    1001: "cloud-sun",
    2000: "cloud-fog",
    2100: "cloud-fog",
    4000: "cloud-rain-light",
    4001: "cloud-rain",
    4200: "cloud-rain-light",
    4201: "cloud-rain",
    5000: "snow",
    5001: "cloud-snowy",
    5100: "cloud-snowy",
    5101: "snow",
    6000: "cloud-snowy",
    6001: "cloud-snowy",
    6200: "cloud-rain-light",
    6201: "cloud-rain",
    7000: "cloud-snowy",
    7101: "snow",
    7102: "snow",
    8000: "cloud-storm"        
}

const DescriptionMap: CodeMapping = {
    0: "Unknown",
    1000: "Clear, Sunny",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
}

export function getWeatherCodeInformation(code: number): WeatherCodeInformation {
    return {
        code: code,
        description: DescriptionMap[code],
        icon: IconMap[code]
    };
}