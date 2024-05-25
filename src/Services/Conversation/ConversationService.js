import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/conversation'; // Replace with your actual API base URL

export const getConversationMembers = async (conversationId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${conversationId}/members`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation members:', error);
    throw error;
  }
};

export const fetchConversationContent = async (conversationId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${conversationId}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`HTTP error! status: ${error.response.status}`);
  }
};
