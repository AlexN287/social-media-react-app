import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/search';

export const searchUsersAsAdmin = async (username, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            params: { username },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
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

export const searchUserConversations = async (term, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversation/user`, {
        params: {
          term: term
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching conversations:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  export const searchUsersByUsername = async (searchTerm, token) => {
    try {
      console.log(token);
      const response = await axios.get(`${API_BASE_URL}`, {
        headers: {'Authorization': `Bearer ${token}` },
        params: { username: searchTerm }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching search results', error);
      throw error;
    }
  };