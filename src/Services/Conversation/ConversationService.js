import axios from 'axios';
import eventBus from '../../Helper/EventBus';

const API_BASE_URL = 'http://localhost:8080/conversation'; 

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

export const createPrivateConversation = async (userId, token, setCreationError) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/private/create?userId=${userId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log(response.data);
    // Reset any previous error message
    setCreationError('');
  } catch (error) {
    if (error.response && error.response.status === 409) { // Assuming 409 status code for conflicts
      setCreationError("A private conversation with this user already exists.");
    } else {
      console.error("Error creating private conversation:", error.response ? error.response.data : error.message);
      setCreationError("Failed to create a private conversation.");
    }
  }
};

export const createGroupConversation = async (groupName, members, groupImage, token) => {
  const formData = new FormData();
  formData.append('name', groupName);
  // Assuming 'members' is an array of integers (user IDs)
  // Append each member ID individually
  members.forEach(memberId => formData.append('members', memberId));

  if (groupImage) {
    formData.append('groupImage', groupImage);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/group/create`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do not set 'Content-Type' here; let axios and FormData handle it
      },
    });

    console.log('Group created successfully:', response.data);
    // Handle success (e.g., navigate to the group conversation or show a success message)
  } catch (error) {
    console.error('Failed to create group:', error.response ? error.response.data : error);
    // Handle errors (e.g., show an error message)
  }
};

export const fetchConversationsList = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation list:', error);
    return []; // Return an empty array as a fallback
  }
};

export const fetchConversationImage = async (conversationId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${conversationId}/image`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching conversation image:', error);
    return null; // Optionally return null or a default image URL in case of error
  }
};

export const fetchMessageMedia = async (filePath, token) => {
  try {
    const response = await axios({
      url: `${API_BASE_URL}/media`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        filePath
      },
      responseType: 'blob'  // Important for handling binary data like images and videos
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    return url;
  } catch (error) {
    console.error('Error fetching message media:', error);
    throw error;
  }
};

export const fetchConversationMembers = async (conversationId, token) => {
  try {
      const response = await axios.get(`http://localhost:8080/conversation/${conversationId}/members`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      return response.data;
  } catch (error) {
      console.error('Failed to fetch members:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch members');
  }
};
export const removeMemberFromConversation = async (conversationId, memberId, token) => {
  try {
      const response = await axios.delete(`http://localhost:8080/conversation/group/${conversationId}/members/remove/${memberId}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Failed to remove member:', error.response ? error.response.data : error.message);
      throw error;
  }
};

export const handleLeaveConversation = async (conversationId, token) => {
  try {
      await axios.delete(`http://localhost:8080/conversation/group/${conversationId}/leave`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
      });
      console.log("Left group successfully.");

      // Emit an event indicating a conversation has been left
      eventBus.emit('leftConversation', conversationId);
  } catch (error) {
      console.error('Error leaving the group:', error.response ? error.response.data : error.message);
      throw error;
  }
};
