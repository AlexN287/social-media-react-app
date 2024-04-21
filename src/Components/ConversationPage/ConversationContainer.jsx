import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import eventBus from '../../Helper/EventBus';
import ShowMembersModal from './ShowMembersModel';
import '../../Styles/Components/ConversationPage/ConversationContainer.css';
import AddMembersModal from './AddMembersModal';


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

const ConversationContainer = ({ token, selectedConversationId, currentConversation, conversationImage }) => {
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [isShowMembersModalOpen, setIsShowMembersModalOpen] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);

  // Function to toggle the group options menu
  const toggleGroupOptions = () => {
    setShowGroupOptions(!showGroupOptions);
  };




  useEffect(() => {
    console.log('Current conversation:', currentConversation);
  }, [currentConversation]);

  useEffect(() => {
    // Fetch messages for the selected conversation
    const fetchMessages = async (conversationId) => {
      try {
        const response = await fetch(`http://localhost:8080/conversation/${conversationId}/messages`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Optionally, transform the received Message entities to a simpler structure similar to MessageDTO
        const transformedMessages = data.map(message => ({
          senderId: message.sender.id, // Assuming the sender object has an id field
          content: message.content.textContent, // Assuming the content object has a textContent field
          timestamp: message.timestamp
        }));

        setMessages(transformedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
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

    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({'Authorization': `Bearer ${token}`}, frame => {
      console.log('WebSocket Connected: ' + frame);
  
      //client.send("/app/verifyToken", {}, JSON.stringify({ token: `Bearer ${token + 'wsdeaedsefd'}` }));

  
      if (selectedConversationId) {
        const subscriptionPath = `/topic/conversations/${selectedConversationId}`;
        client.subscribe(subscriptionPath, (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          setMessages(prevMessages => [...prevMessages, receivedMessage]);
          eventBus.emit('updateLastMessage', {
            conversationId: receivedMessage.conversationId,
            lastMessage: receivedMessage.content,
            lastUpdated: new Date().toISOString()
          });
        });
      }
    }, error => {
      console.error('WebSocket Error', error);
    });
  
    stompClientRef.current = client;
  
    return () => {
      if (client && client.connected) {
        client.disconnect(() => console.log("WebSocket Disconnected"));
      }
    };
  }, [token, selectedConversationId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (stompClientRef.current && stompClientRef.current.connected && messageContent.trim() !== '' && selectedConversationId) {
      const chatMessage = {
        senderId: loggedInUser?.id, // Sending the logged-in user's ID
        conversationId: selectedConversationId, // The conversation ID
        content: messageContent, // The message content
        type: "CHAT", // Message type

      };

      const sendPath = `/app/chat/${selectedConversationId}`;
      stompClientRef.current.send(sendPath, {}, JSON.stringify(chatMessage));
      setMessageContent(''); // Clear input field after sending
      eventBus.emit('updateLastMessage', { conversationId: selectedConversationId, lastMessage: messageContent, lastUpdated: new Date().toISOString() });
    }
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
      <form className="conversation-input" onSubmit={sendMessage}>


        <input type="text" placeholder="Write a message ..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ConversationContainer;