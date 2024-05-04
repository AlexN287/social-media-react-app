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
