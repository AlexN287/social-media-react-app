
import React from 'react';
import '../../Styles/Components/ConversationPage/ConversationItem.css'; 
import { formatDateOrTime } from '../../Helper/Util';

const ConversationItem = ({ conversation, onClick, imageUrl }) => (
  <div className="chat-item" onClick={onClick}>
    <div className="chat-avatar">
      {imageUrl ? (
        <img className='conversation-image' src={imageUrl} alt={conversation.name} style={{ width: 50, height: 50 }} />
      ) : (
        <div className="image-placeholder">Loading...</div> 
      )}
    </div>
    <div className="chat-info">
      <h3 className="chat-name">{conversation.name}</h3>
      <p className="chat-message">{conversation.lastMessage}</p>
    </div>
    <div className="chat-time">
      
      <span>{formatDateOrTime(conversation.lastUpdated)}</span>
    </div>
  </div>
);

export default ConversationItem;
