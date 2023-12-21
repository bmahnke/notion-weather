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