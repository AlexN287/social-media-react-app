import React, { useState } from 'react';
import Button from '../../Common/Button';
import Modal from '../../Common/Modal';
import AutoResizingTextarea from '../../Posts/AutoResizingInput';
import { updateCommentText } from '../../../Services/Posts/CommentService';

const EditCommentModal = ({ isOpen, onClose, comment, onSave }) => {
    const [editedComment, setEditedComment] = useState(comment.content.textContent);
    const token = localStorage.getItem('token'); // Ensure you retrieve the token correctly
    console.log(comment.user.id);

    const handleContentChange = (e) => {
        setEditedComment(e.target.value);
    };

    const handleSave = async () => {
        try {
            const updatedComment = await updateCommentText(comment.id, editedComment, token);
            onSave(comment.id, updatedComment.content.textContent);
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error('Error saving updated comment:', error);
            // Optionally show an error message to the user
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} header="Edit Comment">
            <AutoResizingTextarea
                text={editedComment}
                onChange={handleContentChange}
            />
            <Button color="green" onClick={handleSave}>Save Changes</Button>
        </Modal>
    );
};

export default EditCommentModal;