// Components/ChatPage/ChatsContainer.jsx
import React, { useState, useEffect } from 'react';
import ConversationItem from './ConversationItem';
import eventBus from '../../Helper/EventBus';
import '../../Styles/Components/ConversationPage/ChatsContainer.css';
import SearchBar from '../MainPage/SearchBar';
import { searchUserConversations } from '../../Services/Search/SearchService';
import AddConversationModal from './AddConversationModal';
import { createGroupConversation, createPrivateConversation } from '../../Services/Conversation/ConversationService';
import { getLoggedUser } from '../../Services/User/UserService';
import { fetchFriendsList } from '../../Services/Friends/FriendsService';

const ChatsContainer = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [conversationImages, setConversationImages] = useState({});
  const token = localStorage.getItem('token');
  const [showAddConversationModal, setShowAddConversationModal] = useState(false);
  const [friends, setFriends] = useState([])
  const [selectedFriendIds, setSelectedFriendIds] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [creationError, setCreationError] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    // Function to handle the event
    const handleLastMessageUpdate = (updateInfo) => {
      setConversations(currentConversations => {
        return currentConversations.map(convo => {
          if (convo.id === updateInfo.conversationId) {
            return { ...convo, lastMessage: updateInfo.lastMessage, lastUpdated: updateInfo.lastUpdated };
          }
          return convo;
        });
      });
    };
  
    // Subscribe to the updateLastMessage event
    eventBus.on('updateLastMessage', handleLastMessageUpdate);
  
    // Cleanup function to unsubscribe from the event on component unmount
    return () => {
      eventBus.off('updateLastMessage', handleLastMessageUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchConversationsList = async (token) => {
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
        return conversations;
      } catch (error) {
        console.error('Error fetching conversation list:', error);
        return []; // Return an empty array as a fallback
      }
    };

    const fetchConversationImage = async (conversationId, token) => {
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

        const imageUrl = URL.createObjectURL(await response.blob());
        return imageUrl;
      } catch (error) {
        console.error('Error fetching conversation image:', error);
        return null; // Optionally return null or a default image URL in case of error
      }
    };

    fetchConversationsList(token).then(conversations => {
      setConversations(conversations);
      // conversations.forEach(conversation => {
      //   fetchConversationImage(conversation.id, token).then(imageUrl => {
      //     setConversationImages(prevImages => ({ ...prevImages, [conversation.id]: imageUrl }));
      //   });
      // });
    });
  }, [token]);

  useEffect(() => {
    // Fetch initial conversations list and set up event listeners here...

    // Listen for 'leftConversation' event
    const handleLeftConversation = (conversationId) => {
      setConversations(conversations => conversations.filter(conversation => conversation.id !== conversationId));
      // Optionally, reset selectedConversationId or perform other UI updates
    };

    eventBus.on('leftConversation', handleLeftConversation);

    // Cleanup function to unsubscribe from the event on component unmount
    return () => {
      eventBus.off('leftConversation', handleLeftConversation);
    };
  }, []);

  useEffect(() => {
    getLoggedUser(token).then(user => {
      setLoggedUser(user); // Set the logged user state
      fetchFriendsList(user.id, token).then(friends => {
        setFriends(friends);
      });
    });
  }, [token]);

  const handleSearchResults = (results) => {
    setConversations(results); // Update the conversations state with search results
  };

  const handleAddConversationClick = () => {
    setShowAddConversationModal(true);
  };

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

  const handleSubmit = async () => {
    if (selectedFriendIds.length === 1) {
      await createPrivateConversation(selectedFriendIds[0], token, setCreationError);
    } else if (selectedFriendIds.length > 1 && groupName) {
      await createGroupConversation(groupName, selectedFriendIds, groupImage, token);
      setGroupName('');
      setGroupImage(null);
    }
    setSelectedFriendIds([]);
  };

  return (
    <div className="chats-container">
      <div className="chats-header">
          <h2>Chats</h2>
        </div>
      <div className='chats-search-header'>
        <div className='chat-search-bar'>
        <SearchBar
        searchFunction={(term, token) => searchUserConversations(term, token)}
        onSearchResults={handleSearchResults}
        showResultsContainer={false}
      />
        </div>
      <button className="add-conversation-btn" onClick={handleAddConversationClick}>+</button>
      </div>
      <div className="chat-list">
        {conversations.map(conversation => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onClick={() => onSelectConversation(conversation, conversationImages[conversation.id])}
            //imageUrl={conversationImages[conversation.id]}
          />
        ))}
      </div>
      <AddConversationModal
        isOpen={showAddConversationModal}
        onClose={() => setShowAddConversationModal(false)}
        friends={friends}
        selectedFriendIds={selectedFriendIds}
        toggleFriendSelection={toggleFriendSelection}
        groupName={groupName}
        setGroupName={setGroupName}
        groupImage={groupImage}
        setGroupImage={setGroupImage}
        handleSubmit={handleSubmit}
        creationError={creationError}
      />
    </div>
  );
};

export default ChatsContainer;
