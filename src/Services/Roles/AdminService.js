import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/admin'; 

export const checkIfUserIsAdmin = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/check`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // This will be the boolean value indicating if the user is an admin
    } catch (error) {
        if (error.response) {
            
            throw new Error(error.response.data || 'An unexpected error occurred');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from the server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error in setting up the request');
        }
    }
};

export const getAllUsersWithRoles = async (token, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/usersWithRoles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page: page,
                size: size
            }
        });
        return response.data; // This will be the paginated result of users with roles
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

export const modifyUserRoles = async (userId, roles, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/modifyUserRoles/${userId}`, null, {
            params: { roles: roles.join(',') },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // This will be the success message
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