import React, { useReducer } from "react";
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import SetAuthToken from '../../utils/SetAuthToken';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        error: null
    };

    // State allows us to access anything in our state
    // Dispatch allows us to dispatch objects to the reducer
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {

        // Load token into global headers
        if (localStorage.token) {
            SetAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/auth');

            dispatch({
                type: USER_LOADED,
                payload: res.data
            });

        } catch (err) {
            dispatch({ type: AUTH_ERROR })
        }
    }

    // Register User
    const register = async formData => {
        const config = {
            headers: {
                'Conent-Type': 'application/json'
            }
        }

        try {
            // The response 
            const res = await axios.post('/api/users', formData, config);

            dispatch({
                type: REGISTER_SUCCESS,

                // The payload is the response
                payload: res.data
            });

            loadUser();

        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,

                // The payload is the response
                payload: err.response.data.msg
            });
        }
    }

    // Login User
    const login = async formData => {
        const config = {
            headers: {
                'Conent-Type': 'application/json'
            }
        }

        try {
            // The response 
            const res = await axios.post('/api/auth', formData, config);

            dispatch({
                type: LOGGIN_SUCCESS,

                // The payload is the response
                payload: res.data
            });

            loadUser();

        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,

                // The payload is the response
                payload: err.response.data.msg
            });
        }
    }

    // Logout
    const logout = () => { dispatch({ type: LOGOUT }) };

    // Clear Errors
    const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                loadUser,
                login,
                logout,
                clearErrors
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthState;