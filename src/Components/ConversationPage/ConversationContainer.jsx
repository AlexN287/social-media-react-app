import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../Styles/Components/ConversationPage/ConversationContainer.css';


const ConversationContainer = ({ token, selectedConversationId }) => {
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const getLoggedUser = async (token) => {
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
          setLoggedInUser(user); // Assume the user object has a username or id field
      } catch (error) {
          console.error('Error fetching user profile:', error);
      }
    };

    if (token) {
      getLoggedUser(token);
    }

    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    const connectCallback = () => {
      console.log('WebSocket Connected');
      
      if (selectedConversationId) {
        const subscriptionPath = `/topic/conversations/${selectedConversationId}`;
        client.subscribe(subscriptionPath, (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          setMessages(prevMessages => [...prevMessages, receivedMessage]);
        });
      }
    };

    const errorCallback = (error) => {
      console.error('WebSocket Error', error);
    };

    client.connect({}, connectCallback, errorCallback);
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect(() => console.log("WebSocket Disconnected"));
        stompClientRef.current = null;
      }
    };
  }, [token, selectedConversationId]); // Reconnect if token or selected 
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (stompClientRef.current && stompClientRef.current.connected && messageContent.trim() !== '' && selectedConversationId) {
      const chatMessage = {
        senderId: loggedInUser?.id, // Use the logged in user's ID
        content: messageContent,
        type: "CHAT"
      };

      const sendPath = `/app/chat/${selectedConversationId}`;
      stompClientRef.current.send(sendPath, {}, JSON.stringify(chatMessage));
      setMessageContent(''); // Clear input field
    }
  };

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <h3>Conversation</h3>
      </div>
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.senderId === loggedInUser?.id ? 'you' : 'them'}`}>
            <span>{message.content}</span>
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





// import React, { useState, useEffect } from 'react';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
// import '../../Styles/Components/ConversationPage/ConversationContainer.css';

// const ConversationContainer = ({ token }) => {
//   const [messageContent, setMessageContent] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [stompClient, setStompClient] = useState(null);

//   useEffect(() => {
//     const socket = new SockJS('http://localhost:8080/ws');
//     const client = Stomp.over(socket);

//     const connectCallback = () => {
//       console.log('WebSocket Connected');
//       client.subscribe('/topic/messages', (msg) => {
//         const receivedMessage = JSON.parse(msg.body);
//         setMessages((prevMessages) => [...prevMessages, receivedMessage]);
//       });
//     };

//     const errorCallback = (error) => {
//       console.log('WebSocket Error', error);
//     };

//     client.connect({}, connectCallback, errorCallback);

//     setStompClient(client);

//     console.log("Setting up WebSocket connection and subscribing to /topic/messages");
//   // Subscription code
//   return () => {
//     console.log("Cleaning up WebSocket connection");
//     if (client && client.connected) {
//       client.disconnect(() => {
//         console.log("WebSocket Disconnected");
//       });
//     }
//   };
//   }, [token]); // Dependencies array, if your token changes, reconnect

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (stompClient && stompClient.connected && messageContent.trim() !== '') {
//         const chatMessage = {
//             sender: "username", // Ensure this matches the expected string format on the server
//             content: messageContent,
//             type: "CHAT" // Assuming type is a string in MessageDTO
//         };

//         stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
//         setMessageContent(''); // Clear the input field after sending
//     }
// };


//   return (
//     <div className="conversation-container">
//       <div className="conversation-header">
//         <h3>Conversation</h3>
//       </div>
//       <div className="messages-list">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.sender}`}>
//             <span>{message.content}</span>
//           </div>
//         ))}
//       </div>
//       <form className="conversation-input" onSubmit={sendMessage}>
//         <input type="text" placeholder="Write a message ..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default ConversationContainer;