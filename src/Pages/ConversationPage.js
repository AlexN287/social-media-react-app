import React, { useState } from 'react';
import '../Styles/ConversationPage.css'; // Make sure to create a ChatPage.css file for styles

const ChatPage = () => {
  const chats = [
    { id: 1, name: 'Pink Panda', message: 'You: thnx!', time: '9:36' },
    { id: 2, name: 'Dog Hat', message: "It's so quiet outside 😌", time: '9:36' },
    // ...other chats
  ];


  const messages = [
    { id: 1, sender: 'them', text: 'Hi 👋, How are ya?', time: '0:12' },
    // ... more messages
  ];


  return (
    <div className='chat-page'>
      <nav className="sidebar-menu">
      <ul className="menu-items">
        <li><a href="#"><span className="icon">🏠</span></a></li>
        <li className="messages">
          <a href="#"><span className="icon">✉️</span><span className="message-count">3</span></a>
        </li>
        <li><a href="#"><span className="icon">❤️</span></a></li>
        <li><a href="#"><span className="icon">➕</span></a></li>
        <li><a href="#"><span className="icon">👤</span></a></li>
      </ul>
    </nav>




    <div className="chat-container">
      <div className="chats-header">
        <h2>Chats</h2>
        <div className="chats-header-icons">
          {/* Icons here */}
        </div>
      </div>
      <div className="chats-search">
        <input type="text" placeholder="Search" />
      </div>
      <div className="chat-list">
        {chats.map(chat => (
          <div key={chat.id} className="chat-item">
            <div className="chat-avatar">
              {/* Avatar here, e.g. <img src={chat.avatar} alt={chat.name} /> */}
            </div>
            <div className="chat-info">
              <h3 className="chat-name">{chat.name}</h3>
              <p className="chat-message">{chat.message}</p>
            </div>
            <div className="chat-time">
              <span>{chat.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    





    <div className="conversation-container">
      <div className="conversation-header">
        {/* Conversation header content, such as the name and status of the other user */}
        <h3>Pink Panda</h3>
        <span>Online</span>
        {/* Other icons and actions */}
      </div>
      <div className="messages-list">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <span>{message.text}</span>
            <span className="message-time">{message.time}</span>
          </div>
        ))}
        {/* Add components for sending images, files, etc. */}
      </div>
      <div className="conversation-input">
        {/* Input field and send button */}
        <input type="text" placeholder="Write a message ..." />
        <button>Send</button>
      </div>
    </div>
    </div>




    
  );
};

export default ChatPage;
