import config from '../../config'
import { SET_AUTHENTICATION, SET_USERNAME, SET_AUTHDATA } from "../store/storeconstants";
import { IS_USER_AUTHENTICATED, GET_AUTHDATA, GET_USERNAME } from '../store/storeconstants';

export const userService = {
    login,
    logout,
    isAuthenticated,
    getAccessToken,
    getUserName
}

async function login(username, password) {
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) //< TODO - Validate JSON contract with API
    }

    const response = await fetch(`${config.authUrl}`, request);
    const token = await handleResponse(response);
    //< If login successful - response payload contains access token
    if (token) {
        //< Cache the auth state, username, and token in the store
        this.$store.commit(`auth/${SET_AUTHENTICATION}`, true);
        this.$store.commit(`auth/${SET_USERNAME}`, username);
        this.$store.commit(`auth/${SET_AUTHDATA}`, token);
    }
}

function logout() {
    //< Purge user from local storage to log user out
    this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
    this.$store.commit(`auth/${SET_USERNAME}`, 'Anonymous');
    this.$store.commit(`auth/${SET_AUTHDATA}`, '');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        console.group("Auth result");
        console.log(text);
        console.log(data);
        console.groupEnd();

        if (!response.ok) {
            if (response.status === 401) {
                //< Automatically logout if 401 response returned from the API
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function getAuthData() {
    return {
        username: getUserName(),
        token: getAccessToken(),
    }


    let authState = isAuthenticated();
    let authData = getAccessToken();
}

function isAuthenticated() {
    return this.$store.getters[`auth/${IS_USER_AUTHENTICATED}`]
}

function getAccessToken() {
    return this.$store.getters[`auth/${GET_AUTHDATA}`]
}

function getUserName() {
    return this.$store.getters[`auth/${GET_USERNAME}`]
}