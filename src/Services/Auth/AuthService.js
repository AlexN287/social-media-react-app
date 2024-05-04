import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/auth';

const signIn = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signin`, { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Save token to local storage
      return response.data; // Return the response data, typically user info and token
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error; // Rethrow the error to handle it in the UI component
  }
};

const signUp = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Store the token if one is included in the response
        return response.data; // Return the entire response data
      }
    } catch (error) {
      console.error('Error during registration:', error);
      throw error; // Rethrow the error to be handled in the UI
    }
  };

const logout = async () => {
    const token = localStorage.getItem('token'); // Retrieve the stored token
    if (!token) return;

    try {
        await axios.post(`${API_BASE_URL}/logout`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        localStorage.removeItem('token'); // Ensure token is cleared after successful logout
    } catch (error) {
        console.error('Logout failed', error);
        throw error; // Rethrow to handle it perhaps differently in the UI
    }
};

export default {
  signIn,
  signUp,
  logout
};
