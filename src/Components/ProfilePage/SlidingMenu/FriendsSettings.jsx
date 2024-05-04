import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../../Styles/Components/ProfilePage/SlidingMenu/FriendsSettings.css';

async function getLoggedUser(token) {
    try {
        const response = await fetch('http://localhost:8080/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

async function fetchUserProfileImage(userId, token) {
    try {
        const response = await fetch(`http://localhost:8080/user/${userId}/loadProfileImage`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return URL.createObjectURL(await response.blob());
    } catch (error) {
        console.error('Error fetching profile image:', error);
    }
}

async function fetchFriendsList(userId, token) {
    try {
        const response = await fetch(`http://localhost:8080/friendsList/userFriends/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const friends = await response.json();
        return friends;
    } catch (error) {
        console.error('Error fetching friends list:', error);
    }
}


const FriendsSettings = ({onSave, onClose}) => {
    const [friends, setFriends] = useState([]);
    const [loggedUserId, setLoggedUserId] = useState(null);
    const [friendImages, setFriendImages] = useState({});
    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    useEffect(() => {
        getLoggedUser(token).then(user => {
            setLoggedUserId(user.id);
            fetchFriendsList(user.id, token).then(friends => {
                setFriends(friends);
                // Fetch all profile images after setting friends
                friends.forEach(friend => {
                    fetchUserProfileImage(friend.id, token).then(imageSrc => {
                        setFriendImages(prevImages => ({ ...prevImages, [friend.id]: imageSrc }));
                    });
                });
            });
        });
        
    }, [token]);

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };    

    async function handleDeleteFriend(friendId) {
        const token = localStorage.getItem('token');
        console.log(`Delete friend ${friendId}`);
        try {
            const response = await fetch(`http://localhost:8080/friendsList/delete/${friendId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            const result = await response.text();
            if (response.ok) {
                console.log(result);
                setFriends(currentFriends => currentFriends.filter(friend => friend.id !== friendId));
                onSave();
            } else {
                console.error(result);
                // Handle the error state in the UI
            }
        } catch (error) {
            console.error('Error deleting friend:', error);
            // Handle the error state in the UI
        }
    }
    
    async function handleBlockFriend(blockedUserId) {
        const token = localStorage.getItem('token');
        console.log(`Block friend ${blockedUserId}`);
        try {
            const response = await fetch(`http://localhost:8080/blockList/blockUser/${blockedUserId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            const result = await response.text();
            if (response.ok) {
                console.log(result);
                // Update your state or UI as needed after successful blocking
            } else {
                console.error(result);
                // Handle the error state in the UI, e.g., user is already blocked
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            // Handle the error state in the UI
        }
    }

    return (
        <div className='friends-settings-container'>
            <div className='friends-settings-form'>
            {friends.length > 0 ? (
                <ul>
                    {friends.map(friend => (
                        <li key={friend.id} className='friend-form'>
                            {friendImages[friend.id] ? (
                                <img className='friend-profile-image' onClick={() => handleUserClick(friend.id)} src={friendImages[friend.id]} alt={`${friend.username}'s profile`} style={{width: 50, height: 50}} />
                            ) : (
                                <div>Loading...</div>
                            )}
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