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
    }
}

function logout() {
    //< Purge user from local storage to log user out
    localStorage.removeItem('stac-user');
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

function isAuthenticated() {
    const user = localStorage.getItem('stac-user');
    if (user && user !== null) {
        return true;
    }
    return false;
}

function getAccessToken() {
    const user = localStorage.getItem('stac-user');
    if (user === null) {
        return "";
    }

    return user.authdata;
}

function getUserName() {
    const user = localStorage.getItem('stac-user');
    if (user === null) {
        return "Anonymous";
    }

    return user.name;
}