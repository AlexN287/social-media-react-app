import React, { useState, useEffect } from 'react';
import '../Styles/ConversationPage.css'; 

import Menu from '../Components/MainPage/Menu';

import ChatsContainer from '../Components/ConversationPage/ChatsContainer';
import ConversationContainer from '../Components/ConversationPage/ConversationContainer';
import useSwipe from '../Hooks/Common/useSwipe';

const ChatPage = ({ user }) => {
  const token = localStorage.getItem('token');

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversationImage, setConversationImage] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const handleSelectConversation = (conversation, conversationImage) => {
    setSelectedConversationId(conversation.id);
    setCurrentConversation(conversation);
    setConversationImage(conversationImage);
    setIsChatVisible(false);
  };

  const handleSwipeLeft = () => {
    setIsChatVisible(false);
  };

  const handleSwipeRight = () => {
    setIsChatVisible(true);
  };

  useSwipe(handleSwipeLeft, handleSwipeRight);

  return (
    <div className='chat-page'>
      <Menu />
      <div className={`chat-list-container ${isChatVisible ? 'visible' : ''}`}>
        <ChatsContainer onSelectConversation={handleSelectConversation} token={token} />
      </div>
      <div className='conversation-container'>
        <ConversationContainer
          token={token}
          selectedConversationId={selectedConversationId}
          currentConversation={currentConversation}
          conversationImage={conversationImage}
          user={user}
        />
      </div>
    </div>
  );
};

export default ChatPage;