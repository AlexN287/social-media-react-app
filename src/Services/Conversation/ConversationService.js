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