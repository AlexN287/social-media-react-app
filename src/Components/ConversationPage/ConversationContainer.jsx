import React, { useState, useEffect, useRef } from 'react';
import eventBus from '../../Helper/EventBus';
import ShowMembersModal from './ShowMembersModel';
import '../../Styles/Components/ConversationPage/ConversationContainer.css';
import AddMembersModal from './AddMembersModal';
import { formatDateOrTime } from '../../Helper/Util';
import { useWebSocket } from '../../Context/WebSocketContext';
import { fetchMessages } from '../../Services/Message/MessageService';
import { useNavigate } from 'react-router-dom';

const ConversationContainer = ({ token, selectedConversationId, currentConversation, conversationImage }) => {
  const { client, sendMessage } = useWebSocket();
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [isShowMembersModalOpen, setIsShowMembersModalOpen] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const navigate = useNavigate();

  // Function to toggle the group options menu
  const toggleGroupOptions = () => {
    setShowGroupOptions(!showGroupOptions);
  };

  useEffect(() => {
    console.log('Current conversation:', currentConversation);
  }, [currentConversation]);

  useEffect(() => {
    const loadMessages = async () => {
if(selectedConversationId){
  
  try {
    const msgs = await fetchMessages(selectedConversationId, token);
    setMessages(msgs);
  } catch (err) {

    console.error(err);
  }
}

    };

    loadMessages();
  }, [selectedConversationId, token]);

  useEffect(() => {
    // Fetch logged-in user profile
    const getLoggedUser = async (token) => {
      try {
        const response = await fetch('http://localhost:8080/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        setLoggedInUser(user); // Assuming the user object has a username or id field
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (token) {
      getLoggedUser(token);
    }

    if (!client || !selectedConversationId) {
      return;
    }

    // Subscribe to the WebSocket messages for the selected conversation
    const subscription = client.subscribe(`/topic/conversations/${selectedConversationId}`, (msg) => {
      const receivedMessage = JSON.parse(msg.body);
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
      // Use your event bus or any other state management as needed
      eventBus.emit('updateLastMessage', {
        conversationId: receivedMessage.conversationId,
        lastMessage: receivedMessage.content,
        lastUpdated: new Date().toISOString()
      });
    });

    // Clean up the subscription when component unmounts or dependencies change
    return () => {
      subscription.unsubscribe();
    };
  }, [client, selectedConversationId]); // dependencies include client and selectedConversationId

  // Handle sending new messages
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (messageContent.trim() !== '') {
      sendMessage(`/app/chat/${selectedConversationId}`, {
        senderId: loggedInUser?.id, // Sending the logged-in user's ID
        conversationId: selectedConversationId, // The conversation ID
        content: messageContent, // The message content
        type: "CHAT", // Message type
      });
    }

    setMessageContent('');
  };

  const handleVideoCallClick = () => {
    //window.location.href = '\VideoCall.html';
    navigate("/videocall");
  };

  return (
    <div className="conversation-container">
      {currentConversation && (
        <div className="conversation-header">
          <div className="conversation-info">
            <img src={conversationImage} alt={currentConversation.name} className="conversation-image" />
            <h3>{currentConversation.name}</h3>
          </div>
          {currentConversation.group && (
            <>
              <button onClick={toggleGroupOptions} className="group-options-button">...</button>
              {showGroupOptions && (
                <div className="group-options-menu">
                  <button onClick={() => setIsShowMembersModalOpen(true)}>Show Members</button>
                  <ShowMembersModal
                    isOpen={isShowMembersModalOpen}
                    onClose={() => setIsShowMembersModalOpen(false)}
                    conversationId={selectedConversationId}
                  />
                  <button onClick={() => setIsAddMembersModalOpen(true)}>Add Members</button>
                  <AddMembersModal
                    isOpen={isAddMembersModalOpen}
                    onClose={() => setIsAddMembersModalOpen(false)}
                    conversationId={selectedConversationId}
                    token={token} // Pass token if needed for API calls
                  />
                </div>
              )}
            </>
          )}

          <button onClick={handleVideoCallClick} className="video-call-button">
          📞
          </button>
        </div>

      )}
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className="message-block">
            {/* Apply different classes based on the sender of the message */}
            <div className='message-timestamp'>
              {formatDateOrTime(message.timestamp)}
            </div>
            <div className={`message ${message.senderId === loggedInUser?.id ? 'you' : 'them'}`}>
              <span>{message.content}</span>
            </div>
          </div>
        ))}
      </div>
      <form className="conversation-input" onSubmit={handleSendMessage}>


        <input type="text" placeholder="Write a message ..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ConversationContainer;