import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../Styles/Components/ConversationPage/ConversationContainer.css';

const ConversationContainer = ({ token }) => {
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    const connectCallback = () => {
      console.log('WebSocket Connected');
      client.subscribe('/topic/messages', (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    };

    const errorCallback = (error) => {
      console.log('WebSocket Error', error);
    };

    client.connect({}, connectCallback, errorCallback);

    setStompClient(client);

    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("WebSocket Disconnected");
        });
      }
    };
  }, [token]); // Dependencies array, if your token changes, reconnect

  const sendMessage = (e) => {
    e.preventDefault();
    if (stompClient && stompClient.connected && messageContent.trim() !== '') {
      const chatMessage = {
        sender: "username", // Update accordingly
        content: messageContent,
        type: "CHAT"
      };
  
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      setMessageContent(''); // Clear the input field
    }
  };

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <h3>Conversation</h3>
      </div>
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
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
