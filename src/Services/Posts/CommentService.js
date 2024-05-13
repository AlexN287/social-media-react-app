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

export const deleteComment = async (commentId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${commentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;  // You might return the response or handle it according to your needs
    } catch (error) {
        console.error('Failed to delete comment:', error);
        if (error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error("Network Error");
        }
    }
};

export async function updateCommentText(commentId, newText, token) {
    // Create URLSearchParams object to handle form data.
    const params = new URLSearchParams();
    params.append('text', newText);

    try {
        const response = await axios.patch(`${API_BASE_URL}/edit/${commentId}`, params, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded' // Ensuring the content type is set for form data
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update comment:', error);
        throw error; // Rethrow to handle it in the component
    }
}
