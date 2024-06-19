import React, { useState, useEffect } from 'react';
import Modal from '../../Common/Modal.jsx';
import { fetchComments, addComment } from '../../../Services/Posts/CommentService.js';
import MessageBanner from '../../Common/MessageBanner.jsx';
import Button from '../../Common/Button.jsx';
import InputField from '../../Common/InputField.jsx';
//import { useAuth } from '../../../Context/AuthContext.js';
import LoadingComponent from '../../Common/LoadingComponent.jsx';
import '../../../Styles/Components/Posts/Comments/CommentsModal.css';
import CommentItem from './CommentItem.jsx';

const CommentsModal = ({ isOpen, onClose, post, mediaUrl }) => {
    const { content } = post;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    //const { token } = useAuth(); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (isOpen) {
            loadComments();
        }
    }, [isOpen, post.id, token]);

    const loadComments = () => {
        //setLoading(true);
        setError(null);
        fetchComments(post.id, token)
            .then(comments => {
                setComments(comments)
                console.log(comments);
            })
            .catch(err => {
                setError('Failed to load comments');
                //setLoading(false);
                console.error('Error loading comments:', err);
            });
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return; // Prevent empty comment submissions
        try {
            const newAddedComment = await addComment(post.id, newComment, token);
            setComments(prevComments => [...prevComments, newAddedComment]); // Add the new comment to the existing comments array
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(currentComments => currentComments.filter(comment => comment.id !== commentId));
    };

    const handleUpdateComment = (commentId, updatedText) => {
        setComments(currentComments => currentComments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, content: { ...comment.content, textContent: updatedText }};
            }
            return comment;
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} header="Comments">
            <div className="comments-layout">
                <div className="post-details">
                    <p>{content.textContent}</p>
                    {mediaUrl && (
                        <img src={mediaUrl} alt="Post" style={{ maxWidth: '100%' }} />
                    )}
                </div>
                <div className="comments-section">
                    
                        <>
                            <ul>
                                {comments.length > 0 ? comments.map(comment => (
                                    <li key={comment.id}>
                                        <CommentItem key={comment.id} comment={comment} onDelete={handleDeleteComment} onUpdate={handleUpdateComment}/>
                                    </li>
                                )) : <p>No comments to display.</p>}
                            </ul>
                            <div className='input-container'>
                                <InputField
                                    type="text"
                                    name="newComment"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button color="green" onClick={handleCommentSubmit}>Post</Button>
                            </div>
                        </>
                    
                    {error && <MessageBanner message={error} type='error' onClose={onClose} />}
                </div>

            </div>
        </Modal>
    );
};

export default CommentsModal;
