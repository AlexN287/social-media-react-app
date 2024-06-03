import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OptionsButton from '../../Common/OptionButton';
import UserProfileImage from '../../Common/ProfileImage';
import { formatDateOrTime } from '../../../Helper/Util';
import { getLoggedUser } from '../../../Services/User/UserService';
import { deleteComment } from '../../../Services/Posts/CommentService';
import EditCommentModal from './EditCommentModal';

import '../../../Styles/Components/Posts/Comments/CommentItem.css';

const CommentItem = ({ comment, onDelete, onUpdate }) => {
    const { content, user } = comment;
    const [loggedInUser, setLoggedInUser] = useState(null);
    const location = useLocation();
    const isMyProfile = location.pathname === '/myprofile';
    const token = localStorage.getItem('token');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [canEditOrDelete, setCanEditOrDelete] = useState(false);

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    useEffect(() => {
        if (token) {
            getLoggedUser(token).then(data => {
                setLoggedInUser(data); // Set the logged in user data
                setCanEditOrDelete(isMyProfile || user.id === loggedInUser.id);
            }).catch(error => {
                console.error('Failed to fetch logged in user:', error);
            });
        } else {
            console.error('No token found');
        }
    }, []);

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId, token);
            onDelete(commentId);
            // Update the UI accordingly, e.g., by removing the comment from the list
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUpdateComment = (commentId, newText) => {
        onUpdate(commentId, newText); // Propagate the update handling up
        closeEditModal(); // Close the modal after update
    };


    return (
        <div className="comment-item">
            <div className="comment-profile">
                <UserProfileImage userId={user.id} token={token} size="small" />
            </div>
            <div className="comment-body">
                <div className="comment-main">
                    <strong>{user.username}</strong>
                    <p>{content.textContent}</p>
                    {canEditOrDelete && (
                        <OptionsButton>
                            {loggedInUser && user.id === loggedInUser.id && (
                                <button onClick={openEditModal}>Edit Comment</button>
                            )}
                            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                        </OptionsButton>
                    )}
                </div>
                <span className="comment-time">{formatDateOrTime(comment.timestamp)}</span>
            </div>

            <EditCommentModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                comment={comment}
                onSave={handleUpdateComment}
            />
        </div>
    );
};

export default CommentItem;


