// Components/ChatPage/ChatsContainer.jsx
import React, { useState, useEffect } from 'react';
import ConversationItem from './ConversationItem';
import '../../Styles/Components/ConversationPage/ChatsContainer.css';

const ChatsContainer = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [conversationImages, setConversationImages] = useState({});
  const token = localStorage.getItem('token');

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

  return (
    <div className="chat-list">
      {conversations.map(conversation => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation.id)}
          // imageUrl={conversationImages[conversation.id]}
        />
      ))}
    </div>
  );
};

export default ChatsContainer;
