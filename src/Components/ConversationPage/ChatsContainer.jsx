// Components/ChatPage/ChatsContainer.jsx
import React, { useState, useEffect } from 'react';
import ConversationItem from './ConversationItem';
import eventBus from '../../Helper/EventBus';
import '../../Styles/Components/ConversationPage/ChatsContainer.css';

const ChatsContainer = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [conversationImages, setConversationImages] = useState({});
  const token = localStorage.getItem('token');

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

  return (
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
  );
};

export default ChatsContainer;
