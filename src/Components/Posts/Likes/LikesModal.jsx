import React, { useState, useEffect } from 'react';
import Modal from '../../Common/Modal';
import { fetchLikes } from '../../../Services/Posts/PostService';
import '../../../Styles/Components/Posts/Likes/LikesModal.css';
import UserProfileImage from '../../Common/ProfileImage';

const LikesModal = ({ isOpen, onClose, postId }) => {
    const [likers, setLikers] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchLikes(postId, token)
                .then(data => {
                    setLikers(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching likes:", err);
                    setLoading(false);
                });
        }
    }, [isOpen, postId, fetchLikes]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} header="Users Who Liked This Post">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {likers.length > 0 ? likers.map(user => (
                        <li className='likes-modal-content' key={user.id}>
                            <UserProfileImage userId={user.id} token={token} size={'small'}/>
                            <div className='likes-modal-username'></div>{user.username}
                        </li>
                    )) : <p>No likes yet.</p>}
                </ul>
            )}
        </Modal>
    );
};

export default LikesModal;
