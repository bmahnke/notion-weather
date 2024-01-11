interface AutocompleteProps {
    id: string | undefined,
    name: string,
    class: string,
    value: string | undefined,
    placeholder: string,
    type: "text" | "search",
    children: any,
    onChange: (event: React.InputHTMLAttributes<HTMLInputElement>) => void
}

import React, { useRef, useEffect, useState } from 'react'


export function Autocomplete(props: AutocompleteProps) {
    const [value, setValue] = useState<string | number | readonly string[] | undefined>(props.value)


    function handleOnChange(e: React.InputHTMLAttributes<HTMLInputElement>) {
        // todo: do the things

        setValue(e.value)

        // call prop on change
        props.onChange(e)
    }

    return (
        <input
            id={props.id}
            type={props.type}
            className={props.class}
            value={props.value}
            onChange={handleOnChange}
        />
    )
}