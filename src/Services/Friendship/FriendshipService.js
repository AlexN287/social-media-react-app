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
        status: "PENDING" // Assuming you have a status field to indicate the request state
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
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
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