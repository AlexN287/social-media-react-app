import '../../Styles/Components/Common/Modal.css';
import ReactDOM from 'react-dom';
import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, children, header }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{header}</h2>
        {children}
        <Button color="red" onClick={onClose}>Cancel</Button>
      </div>
    </div>,
    document.body
  );
};
export default Modal;
  