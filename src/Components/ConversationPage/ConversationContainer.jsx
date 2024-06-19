import React, { useState, useEffect, useRef, useCallback } from 'react';
import eventBus from '../../Helper/EventBus';
import ShowMembersModal from './ShowMembersModel';
import '../../Styles/Components/ConversationPage/ConversationContainer.css';
import AddMembersModal from './AddMembersModal';
import MessagesList from './MessageList';
import { useWebSocket } from '../../Context/WebSocketContext';
import { getConversationMembers } from '../../Services/Conversation/ConversationService';
import { fetchMessageMedia } from '../../Services/Conversation/ConversationService';

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
  const [file, setFile] = useState(null);

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
  
      // IIFE to handle async logic
      (async () => {
        if (receivedMessage.filePath) {
          // Fetch the media URL if the message contains a file path
          try {
            const mediaUrl = await fetchMessageMedia(receivedMessage.filePath, token);
            receivedMessage.mediaUrl = mediaUrl;
          } catch (error) {
            console.error('Error fetching message media:', error);
          }
        }
  
        setNewMessage(receivedMessage);
        // Use your event bus or any other state management as needed
        eventBus.emit('updateLastMessage', {
          conversationId: receivedMessage.conversationId,
          lastMessage: receivedMessage.content,
          lastUpdated: new Date().toISOString(),
        });
      })();
    });
  
    // Clean up the subscription when component unmounts or dependencies change
    return () => {
      subscription.unsubscribe();
    };
  }, [client, selectedConversationId, token]);// dependencies include client and selectedConversationId

  // Handle sending new messages
  const handleSendMessage = async (event) => {
    event.preventDefault();

    let filePath = '';

    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', selectedConversationId);
        formData.append('senderId', loggedInUser?.id);
        formData.append('textContent', messageContent); // Include text content

        try {
            const response = await fetch('http://localhost:8080/conversation/uploadFile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json(); // Parse the JSON response
                filePath = data.filePath; // Get the file path from the response
                setFile(null);
            } else {
                console.error('Failed to upload file');
                return; // Exit the function if the file upload fails
            }
        } catch (error) {
            console.error('Failed to upload file', error);
            return; // Exit the function if the file upload fails
        }
    }

    sendMessage(`/app/chat/${selectedConversationId}`, {
        senderId: loggedInUser?.id,
        conversationId: selectedConversationId,
        content: messageContent,
        filePath: filePath, // Set the file path if available
        type: file ? 'FILE' : 'CHAT',
    });

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
        <input type="file" onChange={handleFileChange} />
      </form>
    </div>
  );
};

export default ConversationContainer;