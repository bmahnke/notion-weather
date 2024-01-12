interface AddressComponent {
    long_name: string,
    short_name: string,
    types: string[]
}

interface LatLong {
    lat: number,
    long: number
}

export type GoogleReverseGeocode = {
    response: string,
    datetime: string,
    detail: {
        address_components: AddressComponent[],
        formatted_address: string,
        geometry: {
            bounds: {
                northeast: LatLong,
                southwest: LatLong
            },
            location: LatLong,
            location_type: string,
            viewport: {
                northeast: LatLong,
                southwest: LatLong
            }
        },
        place_id: string,
        types: string[]
    }
};