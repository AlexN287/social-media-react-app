import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = (method, url, data) => {
    return axios({
        method: method,
        url: url,
        data: data,
        withCredentials: true, // Enable sending credentials (cookies) with requests
        headers: {
            'Content-Type': 'application/json', // Set Content-Type to application/json
            'Accept': 'application/json' // Ensure we're expecting a JSON response
        }
    });
};