import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/report';

export async function reportPost(postId, reason, user, token) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}`,
            {
                post: { id: postId },
                reason: reason,
                user: { id: user.id, username: user.username }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Failed to report post:', error);
        throw error; // Re-throw the error if you want to handle it in the component
    }
}

export const deleteReport = async (reportId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete/${reportId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Success message
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || 'An unexpected error occurred');
        } else if (error.request) {
            throw new Error('No response from the server');
        } else {
            throw new Error('Error in setting up the request');
        }
    }
};