import React from 'react';
import '../../Styles/Components/Common/MessageBanner.css';

const MessageBanner = ({ message, type, onClose }) => {
    return (
        <div className={`message-banner ${type}`}>
            {message}
            {onClose && <button onClick={onClose} className="close-btn">✖️</button>}
        </div>
    );
};

export default MessageBanner;
