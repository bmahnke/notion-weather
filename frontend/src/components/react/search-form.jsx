import { useRef } from 'react'

export function SearchForm() {
    const pre = useRef(null);
    const output = useRef(null);

    async function handleSubmit(event) {
		const targetForm = event.target;
		const formData = new FormData(targetForm);

		// const output = document.getElementById("output");
		output.current.textContent = "";

		for (const [key, value] of formData) {
			output.current.textContent += `${key}: ${value}\n`;
		}


		let location = formData.get('search')

		const places = await fetch("http://127.0.0.1:8000/api/places/autocomplete/?place_query=" + location, {
			method: "GET"
		}).then((response) => response.json())


		const place_id = places.detail[0].place_id
		const content = await fetch("http://127.0.0.1:8000/api/weather/realtime?place_id=" + place_id, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}).then((response) => response.json());

		// this.pre = document.getElementById("pre")
		pre.current.textContent = JSON.stringify(content.response.data.values, undefined, 2)

    }

    return (
		<form id="weather-form" onSubmit={handleSubmit} className="flex justify-between w-full" >
			<div id="form-wrapper" className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">Search</label>
					<div className="mt-2">
						<input type="search" 
                            name="search" 
                            id="search" 
                            className="block w-full outline-none rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 focus:ring-orange-500 text-sm"
                            placeholder="Augusta, GA" />
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