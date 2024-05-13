import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const fetchMessages = async (conversationId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversation/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Optionally, transform the received messages
      const transformedMessages = response.data.map(message => ({
        senderId: message.sender.id, // Assuming the sender object has an id field
        content: message.content.textContent, // Assuming the content object has a textContent field
        timestamp: message.timestamp
      }));
  
      return transformedMessages;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error; // Re-throw the error if you want to handle it outside (e.g., in a component)
    }
  };