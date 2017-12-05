import * as React from 'react'
import {clamp} from 'ramda'


type InputProps = {
    label: string,
    value: number,
    min: number,
    max: number,
    onChange: (value: number) => any
}

export default ({label, value, onChange, min, max}: InputProps) => {
    const handler = force => e => {
        const rawValue = Number(e.target.value)
        const value = clamp(min, max, isNaN(rawValue) ? 5 : rawValue)

        // input is correct
        if (force || rawValue === value)
            onChange(value)
    }

    return <div>
                {label}
                <input
                    defaultValue={String(value)}
                    onBlur={handler(true)}
                    onChange={handler(false)}
                />
            </div>
}
