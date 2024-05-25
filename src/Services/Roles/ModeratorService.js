import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/moderator'; // Replace with your actual API base URL

export const checkIfUserIsModerator = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/check`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // This will be the boolean value indicating if the user is a moderator
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