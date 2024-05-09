import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Update to match your actual API base URL

export const getLikesCount = async (postId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/post/${postId}/likes/count`, {
            headers: {
                'Authorization': `Bearer ${token}` // Assuming you are using Bearer token authentication
            }
        });
        return response.data; // Returns the count of likes
    } catch (error) {
        console.error('Error fetching likes count', error);
        throw error; // Rethrowing the error to be handled by the calling component
    }
};

export const addLike = async (postId, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/like/${postId}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data; // Assuming the backend returns the like object
    } catch (error) {
        console.error('Error adding like', error);
        throw error;
    }
};

export const deleteLike = async (postId, token) => {
    try {
        await axios.delete(`${API_BASE_URL}/like/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error deleting like', error);
        throw error;
    }
};

export const checkUserLikedPost = async (postId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/like/${postId}/check`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data; // Directly access data returned from Axios, assumed to be true or false
    } catch (error) {
        console.error('Failed to check like status:', error);

        // Optionally handle different types of errors if needed
        if (error.response) {
            // The server responded with a status outside the 2xx range
            console.error(`HTTP error! status: ${error.response.status}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received');
        } else {
            // Something happened in setting up the request
            console.error('Error', error.message);
        }

        return false;  // Assume not liked if there's an error, or handle differently if required
    }
};