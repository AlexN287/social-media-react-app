import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/Components/ProfilePage/SlidingMenu/BlockedUsers.css';

import { getLoggedUser } from '../../../Services/User/UserService';
import { fetchBlockedUsers, unblockUser } from '../../../Services/BlockList/BlockListService';
import UserProfileImage from '../../Common/ProfileImage';

const BlockedUsers = ({onClose}) => {
    const [blockedUsers, setBlockedUsers] = useState([]); // Correct initialization

    const [loggedUserId, setLoggedUserId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        getLoggedUser(token).then(user => {
            setLoggedUserId(user.id);
            fetchBlockedUsers(user.id, token).then(blockedUsers => {
                setBlockedUsers(blockedUsers);
            });
        });
        
    }, [token]);

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };  

    const handleUnblockUser = async (blockedUserId) => {
        try {
            await unblockUser(blockedUserId, token);
            setBlockedUsers(currentBlockedUsers => currentBlockedUsers.filter(user => user.id !== blockedUserId));
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };
    

    return (
        <div className='blocked-users-container'>
            <div className='blocked-users-form'>
            {blockedUsers.length > 0 ? (
                <ul>
                    {blockedUsers.map(blockedUser => (
                        <li key={blockedUser.id} className='blocked-user-form'>
                            <UserProfileImage userId={blockedUser.id} token={token} size={'small'}/>
                            <span className='blocked-user-username' onClick={() => handleUserClick(blockedUser.id)}>{blockedUser.username}</span>
    
                                
                                <button onClick={() => handleUnblockUser(blockedUser.id)}>Unblock</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className='no-blocked-users-message'>
                    You have no blocked users to display.
                </div>
            )}

        </div>
            <button className='cancel-button' type="button" onClick={onClose}>Cancel</button>
        </div>
        
    );
};

export default BlockedUsers;