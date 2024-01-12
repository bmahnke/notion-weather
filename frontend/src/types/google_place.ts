export type GooglePlace = {
    description: string,
    matched_substrings: [{
        "length": number,
        "offset": number
    }],
    place_id: string,
    reference: string,
    structured_formatting: {
        main_text: string,
        main_text_matched_substrings: [{
                "length": number,
                "offset": number
        }],
        secondary_text: string,
        secondary_text_matched_substrings: [{
            "length": number,
            "offset": number
        }]
    },
    terms: [{
        "offset": number,
        "value": string
    }],
    types: string[]
};