import React, { useReducer } from "react";
import AlertContext from './alertContext';
import { v4 as uuid } from 'uuid';
import alertReducer from './alertReducer';
import {
    SET_ALERT,
    REMOVE_ALERT
} from '../types';

const AlertState = props => {
    const initialState = [];

    // State allows us to access anything in our state
    // Dispatch allows us to dispatch objects to the reducer
    const [state, dispatch] = useReducer(alertReducer, initialState);

    // Set Alert
    const setAlert = (msg, type, timout = 5000) => {
        const id = uuid();
        dispatch({
            type: SET_ALERT,
            payload: { msg, type, id }
        });

        setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timout);
    }

    return (
        <AlertContext.Provider
            value={{
                alerts: state,
                setAlert
            }}>
            {props.children}
        </AlertContext.Provider>
    );
}

export default AlertState;