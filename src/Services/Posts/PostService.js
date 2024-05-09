import axios from 'axios';

const API_URL = 'http://localhost:8080/post'; // Adjust based on your actual API endpoint

export function createPost(token, text, file = null) {
  const formData = new FormData();
  formData.append('text', text);
  if (file) formData.append('file', file);

  const config = {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
      },
  };

  return axios.post(`${API_URL}/add`, formData, config)
      .then(response => response.data)
      .catch(error => {
          throw error.response.data; // This ensures you throw the server-provided error
      });
};

export const getAllPostsByUser = (userId, token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };

    return axios.get(`${API_URL}/${userId}`, config)
        .then(response => response.data)
        .catch(error => {
            throw error.response.data; // This ensures you throw the server-provided error
        });
};

export const fetchPostMedia = async (postId, token) => {
    try {
        const response = await axios({
            url: `${API_URL}/${postId}/media`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
            },
            responseType: 'blob'  // Important for handling binary data like images and videos
        });

        // Create a URL for the blob object to be used in <img> or <video> tags
        const url = window.URL.createObjectURL(new Blob([response.data]));
        return url;
    } catch (error) {
        console.error('Error fetching post media:', error);
        throw error;
    }
};

export async function fetchNrOfPosts(userId, token) {
    try {
        const response = await axios.get(`${API_URL}/count/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data; // axios automatically handles converting the response to JSON
    } catch (error) {
        console.error('Error fetching number of posts:', error);
        throw error; // Re-throw the error if you want to handle it in the component
    }
}

export const fetchLikes = async (postId, token) => {
    try {
        const response = await axios.get(`${API_URL}/${postId}/likes/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // assuming the server response is the list of users
    } catch (error) {
        console.error('Error fetching users who liked the post:', error);
        throw error;
    }
};

export async function fetchFriendsPosts(token) {
    try {
        const response = await axios.get(`${API_URL}/users/friends/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Directly return the data as Axios handles JSON parsing automatically
    } catch (error) {
        console.error('Failed to fetch friends\' posts:', error);
        // Handle specific error responses if necessary
        if (error.response) {
            // Server responded with a status other than 2xx
            throw new Error(`HTTP error, status = ${error.response.status}`);
        } else if (error.request) {
            // No response was received to the request
            throw new Error('No response received');
        } else {
            // An error occurred in setting up the request
            throw new Error(error.message);
        }
    }
}

