import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/search';

export const searchUsersAsAdmin = async (username, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            params: { username },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || 'An unexpected error occurred');
        } else if (error.request) {
            throw new Error('No response from the server');
        } else {
            throw new Error('Error in setting up the request');
        }
    }
};
