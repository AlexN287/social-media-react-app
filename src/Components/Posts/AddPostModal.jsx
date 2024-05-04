import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../Common/Modal';
import { createPost } from '../../Services/Posts/PostService';
import Button from '../Common/Button';
import FileInputField from '../Auth/FileInputField';
import AutoResizingTextarea from './AutoResizingInput';
import MessageBanner from '../Common/MessageBanner.jsx';

const AddPostModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null); // State to handle messages
  const [messageType, setMessageType] = useState(''); // State to handle message type ('success' or 'error')

  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    try {
      await createPost(token, file, text); // Assuming createPost is a method from your PostService
      setMessage('Post created successfully!');
      setMessageType('success');
      setTimeout(() => {
        setMessage(null); // Hide message after some time or on modal close
        onClose(); // Close modal on successful post submission
      }, 3000);
    } catch (error) {
      setMessage(`Failed to create post: ${error}`);
      setMessageType('error');
      setTimeout(() => {
        setMessage(null); // Optionally clear message after display
      }, 3000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {
      setMessage(null); // Clear any messages when closing the modal
      onClose();
    }} header="Add a new post">
      <AutoResizingTextarea text={text} onChange={(e) => setText(e.target.value)} />
      <FileInputField name="post" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <Button color="green" onClick={handleSubmit}>Submit Post</Button>
      {message && <MessageBanner message={message} type={messageType} />}
    </Modal>
  );
};

export default AddPostModal;