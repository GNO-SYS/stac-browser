import config from '../../config'

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

        const user = {
            name: username,
            authdata: token 
        };

        //< Cache current 'stac-user' in local storage
        localStorage.setItem('stac-user', JSON.stringify(user));

        return true;
    }
    
    return Promise.reject("Failed to authenticate with remote server");
}

function logout() {
    //< Purge user from local storage to log user out
    localStorage.removeItem('stac-user');
}

function handleResponse(response) {
    return response.text().then(text => {
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return text;
    });
}

function isAuthenticated() {
    const user = JSON.parse(localStorage.getItem('stac-user'));
    if (user && user !== null) {
        return true;
    }
    return false;
}

function getAccessToken() {
    const user = JSON.parse(localStorage.getItem('stac-user'));
    if (user === null) {
        return "";
    }

    return user.authdata;
}

function getUserName() {
    const user = JSON.parse(localStorage.getItem('stac-user'));
    if (user === null) {
        return "Anonymous";
    }

    return user.name;
}