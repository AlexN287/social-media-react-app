import React, { useState, useEffect } from 'react';
import '../Styles/ConversationPage.css'; // Make sure to create a ChatPage.css file for styles
import axios from 'axios';

import Modal from '../Components/ConversationPage/AddConversation';

import Menu from '../Components/MainPage/Menu';

const formatDateOrTime = (dateTimeString) => {
  const messageDate = new Date(dateTimeString);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset current date to midnight for comparison

  if (dateTimeString === null) {
    return dateTimeString;
  }

  if (messageDate >= currentDate) {
    // If the message was sent today, return the time
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // If the message was sent on a previous date, return the date
    return messageDate.toLocaleDateString();
  }
};

async function getLoggedUser(token) {
  try {
    const response = await fetch('http://localhost:8080/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}




async function fetchConversationImage(conversationId, token) {
  try {
    const response = await fetch(`http://localhost:8080/conversation/${conversationId}/image`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Create a URL from the blob returned by the fetch operation
    const imageUrl = URL.createObjectURL(await response.blob());
    return imageUrl;
  } catch (error) {
    console.error('Error fetching conversation image:', error);
    return null; // Optionally return null or a default image URL in case of error
  }
}

async function fetchConversationsList(token) {
  try {
    const response = await fetch('http://localhost:8080/conversation/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const conversations = await response.json();
    console.log(conversations)
    return conversations;
  } catch (error) {
    console.error('Error fetching conversation list:', error);
    return []; // Return an empty array as a fallback to avoid further errors
  }
}




const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationImages, setConversationImages] = useState({});
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
  const [messages, setMessages] = useState([]);
  const [showAddConversationModal, setShowAddConversationModal] = useState(false);
  const [friends, setFriends] = useState([])
  const [selectedFriendIds, setSelectedFriendIds] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [creationError, setCreationError] = useState('');



  const toggleFriendSelection = (friendId) => {
    setSelectedFriendIds(prev => {
      if (prev.includes(friendId)) {
        // Remove the friend from the selection if already selected
        console.log(friendId)
        return prev.filter(id => id !== friendId);
      } else {
        // Add the friend to the selection if not already selected
        return [...prev, friendId];
      }
    });
  };


  const handleAddConversationClick = () => {
    setShowAddConversationModal(true);
  };



  async function fetchFriends(userId, token) {
    try {
      const response = await fetch(`http://localhost:8080/friendsList/userFriends/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const friends = await response.json();
      return friends;
    } catch (error) {
      console.error('Error fetching friends list:', error);
    }
  }

  useEffect(() => {
    // Assuming a function fetchConversationsList exists that fetches the list of conversations
    fetchConversationsList(token).then(conversations => {
      setConversations(conversations);
      // Fetch all conversation images after setting conversations
      // conversations.forEach(conversation => {
      //   fetchConversationImage(conversation.id, token).then(imageUrl => {
      //     setConversationImages(prevImages => ({ ...prevImages, [conversation.id]: imageUrl }));
      //   });
      // });
    });
  }, [token]); // Dependency array to re-run the effect if the token changes

  useEffect(() => {
    const token = localStorage.getItem('token');
    getLoggedUser(token).then(user => {
      fetchFriends(user.id, token).then(friends => {
        setFriends(friends);

      });
    });
  }, []); // Add dependencies as needed, e.g., userId or token if they might change

  const handleSubmit = async () => {
    if (selectedFriendIds.length === 1) {
      // Logic to create a private conversation with the selected friend
      await createPrivateConversation(selectedFriendIds[0]);
    } else if (selectedFriendIds.length > 1 && groupName) {
      // Ensure groupName is provided; handle groupImage if provided
      await createGroupConversation(groupName,selectedFriendIds ,groupImage);
      // Reset group-related states after submission
      setGroupName('');
      setGroupImage(null);
    }

    // Reset selections and potentially close the modal or clear other related states
    setSelectedFriendIds([]);
  };


  const createPrivateConversation = async (userId) => {
    const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
  
    try {
      const response = await axios.post(`http://localhost:8080/conversation/private/create?userId=${userId}`, {}, {
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
  

  const createGroupConversation = async (groupName, members, groupImage) => {
    const formData = new FormData();
    formData.append('name', groupName);
    // Assuming 'members' is an array of integers (user IDs)
    // Append each member ID individually
    members.forEach(memberId => formData.append('members', memberId));
    
    if (groupImage) {
      formData.append('groupImage', groupImage);
    }
  
    try {
      const token = localStorage.getItem('token'); // Retrieve your auth token
      const response = await axios.post('http://localhost:8080/conversation/group/create', formData, {
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
  
  

  return (
    <div className='chat-page'>
      <Menu />
      <div className="chat-container">
        {/* Chat list UI */}
        <div className="chats-header">
          <h2>Chats</h2>
        </div>
        <div className="chats-search-header">
          <input type="text" placeholder="Search" />
          <button className="add-conversation-btn" onClick={handleAddConversationClick}>+</button>
        </div>

        <div className="chat-list">
          {conversations.map(conversation => (
            <div key={conversation.id} className="chat-item" onClick={() => {/* handle conversation selection here */ }}>
              <div className="chat-avatar">
                {/* {conversationImages[conversation.id] ? (
                  <img className='conversation-image' src={conversationImages[conversation.id]} alt={conversation.name} style={{ width: 50, height: 50 }} />
                ) : (
                  <div>Loading...</div> // Placeholder or spinner while the image is loading
                )} */}
              </div>
              <div className="chat-info">
                <h3 className="chat-name">{conversation.name}</h3>
                <p className="chat-message">{conversation.lastMessage}</p>
              </div>
              <div className="chat-time">
                <span>{formatDateOrTime(conversation.lastUpdated)}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="conversation-container">
        {/* Placeholder for selected conversation header */}
        <div className="conversation-header">
          <h3>Conversation Name</h3> {/* Example static header */}
        </div>
        <div className="messages-list">
          {/* Example messages, replace with dynamic content as needed */}
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <span>{message.text}</span>
              <span className="message-time">{message.time}</span>
            </div>
          ))}
        </div>
        <div className="conversation-input">
          <input type="text" placeholder="Write a message ..." />
          <button>Send</button>
        </div>
      </div>
      <Modal isOpen={showAddConversationModal} onClose={() => setShowAddConversationModal(false)}>
        <h2 className='modal-add-conv-header'>Select Friends</h2>
        <ul className='modal-add-conv-ul'>
          {friends.map(friend => (
            <li className='modal-add-conv-li' key={friend.id} onClick={() => toggleFriendSelection(friend.id)}>
              {friend.username}
              <span className={`selection-circle ${selectedFriendIds.includes(friend.id) ? 'selected' : ''}`}>
                {selectedFriendIds.includes(friend.id) && '✓'}
              </span>
            </li>
          ))}
        </ul>

        {selectedFriendIds.length > 1 && (
          <>
            <input
              className='group-name'
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
            />
            <input
              className='group-image'
              type="file"
              accept="image/*"
              onChange={e => setGroupImage(e.target.files[0])}
            />
          </>
        )}


        <button className='create-conversation-btn' onClick={handleSubmit}>Add Conversation</button>

        {creationError && (
          <div className="creation-error-message">
            {creationError}
          </div>
        )}

      </Modal>
    </div>
  );
};

export default ChatPage;