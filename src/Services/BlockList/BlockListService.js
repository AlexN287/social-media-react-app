import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/blockList'; // Adjust this to your actual API base URL

export const checkIfUserIsBlockedBy = async (token, otherUserId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/isBlockedBy/${otherUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // This will be the boolean value indicating if the user is blocked
    } catch (error) {
        console.error('Error checking if user is blocked:', error);
        throw error;
    }
};

export const fetchBlockedUsers = async (userId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/blockedBy/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Return the fetched data
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        throw error; // Re-throw the error to handle it in the calling component
    }
};

export const unblockUser = async (blockedUserId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/unblock/${blockedUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error unblocking user:', error);
        throw error;
    }
};

export const blockUser = async (blockedUserId, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/blockUser/${blockedUserId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error blocking user:', error);
        throw error;
    }
};