import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/user';

// Function to fetch user profile image
// export async function fetchUserProfileImage(userId, token) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/${userId}/loadProfileImage`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         return URL.createObjectURL(await response.blob());
//     } catch (error) {
//         console.error('Error fetching profile image:', error);
//         throw error;  // Rethrow to handle it on the component level
//     }
// }

export async function fetchUserProfileImage(userId, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}/loadProfileImage`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return URL.createObjectURL(await response.blob());
    } catch (error) {
        console.error('Error fetching profile image:', error);
        throw error;  // Rethrow to handle it on the component level
    }
}

export async function getLoggedUser(token) {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data; // Axios automatically handles converting the response to JSON
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error; // Re-throw the error if you want to handle it in the component
    }
}

export async function fetchUserDetails(userId, token) {
    const url = `${API_BASE_URL}/${userId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;  // Axios automatically parses the JSON response
    } catch (error) {
        console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error if you want to handle it in the calling function
    }
}

export const fetchConnectedFriends = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/connectedFriends`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Return the data directly
    } catch (err) {
        console.error('Failed to fetch connected friends:', err);
        throw new Error('Failed to fetch connected friends'); // Throw an error to be handled by the caller
    }
};