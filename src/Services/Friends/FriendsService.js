import axios from 'axios';

const API_URL = 'http://localhost:8080/friendsList'; 

// Function to fetch the number of friends for a user
export async function fetchNrOfFriends(userId, token) {
    try {
        const response = await axios.get(`${API_URL}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data; // axios automatically handles converting the response to JSON
    } catch (error) {
        console.error('Error fetching number of friends:', error);
        throw error; // Re-throw the error if you want to handle it in the component
    }
}

export async function checkIfUsersAreFriends(token, userId1, userId2) {
    try {
        const url = `${API_URL}/checkFriendship?userId1=${userId1}&userId2=${userId2}`;
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data; // Axios automatically handles converting to JSON
    } catch (error) {
        console.error('Error checking if users are friends:', error);
        throw error; // Re-throw the error if you want to handle it in the component
    }
}

export const fetchFriendsList = async (userId, token) => {
    try {
        const response = await axios.get(`${API_URL}/userFriends/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Return the fetched data
    } catch (error) {
        console.error('Error fetching friends list:', error);
        throw error; // Re-throw the error to handle it in the calling component
    }
};

export const deleteFriend = async (friendId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${friendId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting friend:', error);
        throw error;
    }
};