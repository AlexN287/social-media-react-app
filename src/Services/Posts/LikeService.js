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