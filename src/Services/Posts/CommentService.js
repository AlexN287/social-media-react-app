import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/comment'; // Update to match your actual API base URL

export const getCommentsCount = async (postId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${postId}/count`, {
            headers: {
                'Authorization': `Bearer ${token}` // Including the token in the request headers
            }
        });
        return response.data; // Returns the count of comments
    } catch (error) {
        console.error('Error fetching comments count', error);
        throw error; // Rethrowing the error to be handled by the calling component
    }
};

// Function to fetch comments for a given post with authentication
export const fetchComments = async (postId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${postId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}` // Including the token in the request headers
            }
        });
        return response.data; // Returns the array of comments
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error; // Rethrowing the error to be handled by the calling component
    }
};

export const addComment = async (postId, commentText, token) => {
    try {
        // Encode the comment text to ensure it's safe to include in a URL
        const url = `${API_BASE_URL}/${postId}?commentText=${encodeURIComponent(commentText)}`;
        const response = await axios.post(url, null, { // Passing null as there's no body content
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data; // Returns the added comment
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};
