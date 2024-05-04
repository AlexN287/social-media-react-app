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
