export function  getTimePart (dateTime: string, part: string): string | undefined {
    const dt = new Date(dateTime)

    let opts = Object.assign({})
    switch (part) {
        case '12-hour':
            opts = Object.assign({}, { hour: 'numeric', hour12: true })
        default:
            break;
    }

    const dateFormatter = new Intl.DateTimeFormat('en-US', opts)
    return dateFormatter.format(dt)
}

export function  getDatePart (dateTime: string, part: string): string | undefined {
    const dt = new Date(dateTime)

    let opts = Object.assign({})
    switch (part) {
        case 'short-day':
            opts = Object.assign({}, { weekday: 'short' })
        case 'long-day':
            opts = Object.assign({}, { weekday: 'long' })
        default:
            break;
    }

    const dateFormatter = new Intl.DateTimeFormat('en-US', opts)
    return dateFormatter.format(dt)
}