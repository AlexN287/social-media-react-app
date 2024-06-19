import axios from 'axios';

const API_URL = 'http://localhost:8080/friendship';

export async function checkFriendRequestExists(token, senderId, receiverId) {
    const url = `${API_URL}/exists/${senderId}/${receiverId}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Axios automatically handles converting the response to JSON
    } catch (error) {
        console.error('Error checking if friend request exists:', error);
        throw error; // Re-throw the error if you want to handle it in the component
    }
};

export async function sendFriendRequest(token, senderId, receiverId) {
    const url = `${API_URL}/sendRequest`;
    const body = {
        sender: { id: senderId },
        receiver: { id: receiverId },
        status: "PENDING" 
    };

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Axios automatically handles converting the response to JSON
    } catch (error) {
        console.error('Error sending friend request:', error);
        if (error.response) {
           
            throw new Error(`HTTP error! status: ${error.response.status}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error', error.message);
        }
    }
};

export const fetchFriendRequests = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/requests`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        throw error;
    }
};

export const acceptFriendRequest = async (senderId, token) => {
    try {
        const response = await axios.post(`${API_URL}/acceptRequest`, null, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { senderId }
        });
        return response.data;
    } catch (error) {
        console.error('Error accepting friendship request:', error);
        throw error;
    }
};

export const declineFriendRequest = async (senderId, token) => {
    try {
        const response = await axios.patch(`${API_URL}/declineRequest`, null, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { senderId }
        });
        return response.data;
    } catch (error) {
        console.error('Error declining friendship request:', error);
        throw error;
    }
};