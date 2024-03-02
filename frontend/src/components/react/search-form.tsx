import React, { useEffect, useState } from 'react'
import { type GooglePlace } from '../../types/google_place';
import { type GoogleReverseGeocode } from '../../types/google_reverse_geocode';
import { type ApiResponse } from '../../types/api_response';
import { weatherFetch } from '../../helpers/api';

interface SearchFormProps {
	onPlaceSelect: (selected: GooglePlace | undefined) => void
}

export function SearchForm(props: SearchFormProps) {
	const [query, setQuery] = useState<string | undefined>("")
	const [options, setOptions] = useState<GooglePlace[]>([])
	const [selectedOption, setSelectedOption] = useState<GooglePlace | undefined>(undefined)

	useEffect(() => {
		if (query && query.length > 3) {
			queryPlaces()
		} else{
			setOptions([])
		}			
	}, [query])

	useEffect(() => {
		props.onPlaceSelect(selectedOption)
	}, [selectedOption])

	async function queryPlaces() {
		const url = new URL("http://127.0.0.1:8000/api/places/autocomplete/");
		url.searchParams.set("place_query", query || "");

		const places = await weatherFetch<ApiResponse<GooglePlace>>(url.toString(), {
			method: "GET"
		});

		setOptions(places.detail)
	}

    async function handleSubmit(event : React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		await queryPlaces()
    }

	function handleGetCurrentLocation() {
		const geoOptions = {
			timeout: 10 * 1000,
		};

		const geoSuccess = async function (position: GeolocationPosition) {
			const lat = position.coords.latitude;
			const long = position.coords.longitude;
			const location = `${lat}, ${long}`;

			const url = new URL("http://127.0.0.1:8000/api/places/reverse-geocode");
			url.searchParams.set("place_id", location)
			
			const reverseGeocode = await weatherFetch<GoogleReverseGeocode>(url.toString(), {
				method: "GET"
			});

			const googlePlaceOpt = {
				place_id: reverseGeocode.detail.place_id,
				description: reverseGeocode.detail.formatted_address,
				types: reverseGeocode.detail.types
			} as GooglePlace
			
			// this isn't quite working... there are still options that appear
			setQuery(() => googlePlaceOpt.description)
			setOptions(() => [])
			setSelectedOption(() => googlePlaceOpt)
		};
		const geoError = function (error: GeolocationPositionError) {
			console.log('Error occurred. Error code: ' + error.code);
		};

		navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);				
	}

	async function onSelect(option: GooglePlace) {
		setQuery(option.description)
		setSelectedOption(option)
	}

    return (
		<form id="weather-form" onSubmit={(e) => handleSubmit(e)} className="flex justify-between w-full" >
			<div id="form-wrapper" className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">Search</label>
					<div className="mt-2">
						<input 
							type="search"
							id="search"
							value={query}
							name="search"
							onChange={(e) => setQuery(e.target.value)}
							className="block w-full outline-none rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 focus:ring-orange-500 text-sm"
							placeholder='Augusta, GA'
						/>
						{options.length > 1 && 
							<ul className=" bg-white -mt-1">
							{
								options.map((option: GooglePlace, index: number) => {
									return (
										<li className={index % 2 == 0 ? "cursor-pointer px-2 py-0.5 bg-gray-100 hover:bg-gray-200" : "cursor-pointer px-2 py-0.5 hover:bg-gray-200"}
											key={option.place_id} 
											onClick={() => onSelect(option)}
										>
											{option.description}
										</li>
									)
								})
							}
							</ul>
						}
					</div>
				</div>

				<div className="flex space-x-4 items-center">
					<button type="button" onClick={handleGetCurrentLocation} className="hover:text-orange-500" aria-label="Use Current Location">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
						</svg>						
					</button>
				</div>
			</div>
		</form>
    )
}

export default SearchForm;