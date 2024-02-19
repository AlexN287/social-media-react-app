import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/Components/ProfilePage/SlidingMenu/BlockedUsers.css';

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


const BlockedUsers = ({onClose}) => {
    const [blockedUsers, setBlockedUsers] = useState([]); // Correct initialization

    const [loggedUserId, setLoggedUserId] = useState(null);
    const [blockedUsersImages, setBlockedUsersImages] = useState({});
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        getLoggedUser(token).then(user => {
            setLoggedUserId(user.id);
            fetchBlockedUsers(user.id, token).then(blockedUsers => {
                setBlockedUsers(blockedUsers);
                // Fetch all profile images after setting friends
                // blockedUsers.forEach(blockedUser => {
                //     fetchUserProfileImage(blockedUser.id, token).then(imageSrc => {
                //         setBlockedUsersImages(prevImages => ({ ...prevImages, [blockedUser.id]: imageSrc }));
                //     });
                // });
            });
        });
        
    }, [token]);

    async function fetchBlockedUsers(userId, token) {
        try {
            const response = await fetch(`http://localhost:8080/blockList/blockedBy/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            return data; // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            // Handle errors here, such as setting an error message in state
        }
    }

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };  

    async function handleUnblockUser(blockedUserId) {
        try {
            const jwtToken = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/blockList/unblock/${blockedUserId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`, // Make sure the token is sent correctly
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.text();
            console.log(result);
            // Remove the unblocked user from the blocked users list in the UI
            setBlockedUsers(currentBlockedUsers => currentBlockedUsers.filter(user => user.id !== blockedUserId));
        } catch (error) {
            console.error('Error unblocking user:', error);
            // Handle errors here, such as setting an error message in state
        }
    }
    

    return (
        <div className='blocked-users-container'>
            <div className='blocked-users-form'>
            {blockedUsers.length > 0 ? (
                <ul>
                    {blockedUsers.map(blockedUser => (
                        <li key={blockedUser.id} className='blocked-user-form'>
                            {/* {blockedUsersImages[blockedUser.id] ? (
                                <img className='blocked-user-profile-image' onClick={() => handleUserClick(blockedUser.id)} src={blockedUsersImages[blockedUser.id]} alt={`${blockedUser.username}'s profile`} style={{width: 50, height: 50}} />
                            ) : (
                                <div>Loading...</div>
                            )} */}
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