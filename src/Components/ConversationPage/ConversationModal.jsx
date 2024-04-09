import '../../Styles/Components/ConversationPage/AddConversation.css'
import ReactDOM from 'react-dom';
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button className="modal-close" onClick={onClose}>Cancel</button>
      </div>
    </div>,
    document.body
  );
};
export default Modal;
  