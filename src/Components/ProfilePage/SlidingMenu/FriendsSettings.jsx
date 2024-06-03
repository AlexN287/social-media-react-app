import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../../Styles/Components/ProfilePage/SlidingMenu/FriendsSettings.css';

import { getLoggedUser } from '../../../Services/User/UserService';
import UserProfileImage from '../../Common/ProfileImage';
import { fetchFriendsList, deleteFriend } from '../../../Services/Friends/FriendsService';
import { blockUser } from '../../../Services/BlockList/BlockListService';

const FriendsSettings = ({onSave, onClose}) => {
    const [friends, setFriends] = useState([]);
    const [loggedUserId, setLoggedUserId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    useEffect(() => {
        getLoggedUser(token).then(user => {
            setLoggedUserId(user.id);
            fetchFriendsList(user.id, token).then(friends => {
                setFriends(friends);
                
                
            });
        });
        
    }, [token]);

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };    

    const handleDeleteFriend = async (friendId) => {
        try {
            await deleteFriend(friendId, token);
            setFriends(currentFriends => currentFriends.filter(friend => friend.id !== friendId));
            onSave();
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    };

    const handleBlockFriend = async (blockedUserId) => {
        try {
            await blockUser(blockedUserId, token);
            setFriends(currentFriends => currentFriends.filter(friend => friend.id !== blockedUserId));
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    return (
        <div className='friends-settings-container'>
            <div className='friends-settings-form'>
            {friends.length > 0 ? (
                <ul>
                    {friends.map(friend => (
                        <li key={friend.id} className='friend-form'>
                            <UserProfileImage userId={friend.id} token={token} size={'small'}/>
                            <span className='friend-username' onClick={() => handleUserClick(friend.id)}>{friend.username}</span>
    
                            <div className='buttons'>
                                <button onClick={() => handleDeleteFriend(friend.id)}>Delete</button>
                                <button onClick={() => handleBlockFriend(friend.id)}>Block</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className='no-friends-message'>
                    You have no friends to display.
                </div>
            )}

        </div>
            <button className='cancel-button' type="button" onClick={onClose}>Cancel</button>
        </div>
        
    );
    
};

export default FriendsSettings;