import axios from 'axios';

const API_URL = 'http://localhost:8080/friendsList'; // Base URL for your API

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
