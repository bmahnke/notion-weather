import React, { useRef, useEffect, useState } from 'react'
import { type GooglePlace } from '../../types/googlePlace';
import { type ApiResponse } from '../../types/api_response';
import { weatherFetch } from '../../helpers/api';

interface SearchFormProps {
	onPlaceSelect: (selected: GooglePlace | undefined) => void
}

export function SearchForm(props: SearchFormProps) {
    const pre = useRef(null);
    const output = useRef(null);

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
		// @ts-ignore
		output.current.textContent = "";
		//@ts-ignore
		output.current.textContent += `query: ${query}\n`;

		props.onPlaceSelect(selectedOption)
	}, [selectedOption])

	async function queryPlaces() {
		let url = new URL("http://127.0.0.1:8000/api/places/autocomplete/");

		//@ts-ignore
		url.searchParams.set("place_query", query?.toString());

		const places = await weatherFetch<ApiResponse<GooglePlace>>(url.toString(), {
			method: "GET"
		});

		setOptions(places.detail)
	}

    async function handleSubmit(event : React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		await queryPlaces()
    }

	async function onSelect(option: GooglePlace) {
		setQuery(option.description)
		setSelectedOption(option)

		const content = await fetch("http://127.0.0.1:8000/api/weather/realtime?place_id=" + option.place_id, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}).then((response) => response.json());

		//@ts-ignore
		pre.current.textContent = JSON.stringify(content.response.data.values, undefined, 2)
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

				<div>
					<button type="submit" form="weather-form" className="p-2 rounded-md bg-slate-500 text-gray-100">Click</button>
				</div>
			</div>

			<div>
				<output id="output" ref={output}></output>
				<pre id="pre" ref={pre}></pre>
			</div>
		</form>
    )
}

export default SearchForm;