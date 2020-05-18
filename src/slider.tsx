import {useState, useEffect, useRef, Fragment} from 'react';
import React = require('react');

export interface ISliderProps{
    value: number,
    property?: AudioParam,
    onInput?: Function,
    maxValue?: number,
    minValue?: number,
    step?: number,
    label?: string
}

export const Slider: React.FC<ISliderProps> = (props) => {
    const [state, setState] = useState({
        value: props.value,
    })
    const labelRef  = React.createRef();
    return (
        <Fragment>
            <input type='range' role='slider'  
                aria-label={props.label}
                aria-valuenow={props.value}
                aria-valuemin={props.maxValue || null}
                aria-valuemax={props.minValue || null}
                aria-step={props.step || null}
            ></input>
        </Fragment>
    )
}