import React, { useState, useEffect, useRef, useCallback } from 'react';
import eventBus from '../../Helper/EventBus';
import ShowMembersModal from './ShowMembersModel';
import '../../Styles/Components/ConversationPage/ConversationContainer.css';
import AddMembersModal from './AddMembersModal';
import MessagesList from './MessageList';
import { formatDateOrTime } from '../../Helper/Util';
import { useWebSocket } from '../../Context/WebSocketContext';
import { fetchMessages } from '../../Services/Message/MessageService';
import { useNavigate } from 'react-router-dom';
import { getConversationMembers } from '../../Services/Conversation/ConversationService';

import { useCallInvitation } from '../../Context/CallInvitationContext';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const ConversationContainer = ({ token, selectedConversationId, currentConversation, conversationImage}) => {
  const { client, sendMessage } = useWebSocket();
  const [messageContent, setMessageContent] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const [isShowMembersModalOpen, setIsShowMembersModalOpen] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const zp = useCallInvitation();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState(null);

  const [members, setMembers] = useState([]);

  // Function to toggle the group options menu
  const toggleGroupOptions = () => {
    setShowGroupOptions(!showGroupOptions);
  };

  useEffect(() => {
    console.log('Current conversation:', currentConversation);
  }, [currentConversation]);

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
      setNewMessage(receivedMessage);
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

  useEffect(() => {
    
    const fetchMembers = async () => {
      try {
        const data = await getConversationMembers(selectedConversationId, token);
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch conversation members');
      } 
    };

    if(selectedConversationId){
      fetchMembers();
    }

    
  }, [selectedConversationId, token]);

  const handleInvite = () => {
    const callees = members.map(member => ({
      userID: member.id + "", // Ensure userID is a string
      userName: member.name
    }));
    
    zp.sendCallInvitation({
      callees,
      callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
      timeout: 60, // Timeout duration (second). 60s by default, range from [1-600s].
    }).then((res) => {
      console.warn(res);
    })
    .catch((err) => {
      console.warn(err);
    });
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

          <button onClick={handleInvite} className="video-call-button">
          📞
          </button>
        </div>

      )}

      <MessagesList conversationId={selectedConversationId} token={token} size={size} newMessage={newMessage}/>
      <form className="conversation-input" onSubmit={handleSendMessage}>
        <input type="text" placeholder="Write a message ..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ConversationContainer;