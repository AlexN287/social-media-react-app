import React, { useState, useEffect } from 'react';
import '../../Styles/Components/ProfilePage/ProfileHeader.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

async function fetchNrOfPosts(userId, token) {
    try {
        const response = await fetch(`http://localhost:8080/post/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const nrOfPosts = await response.json();
        return nrOfPosts;
    } catch (error) {
        console.error('Error fetching number of posts:', error);
    }
}

async function fetchNrOfFriends(userId, token) {
    try {
        const response = await fetch(`http://localhost:8080/friendsList/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const nrOfFriends = await response.json();
        return nrOfFriends;
    } catch (error) {
        console.error('Error fetching number of friends:', error);
    }
}



function ProfileHeader() {
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [nrOfPosts, setNrOfPosts] = useState(0);
    const [nrOfFriends, setNrOfFriends] = useState(0);
    const [showEditWindow, setShowEditWindow] = useState(false);
    const navigate = useNavigate();
    const toggleEditWindow = () => setShowEditWindow(!showEditWindow);

    useEffect(() => {
        const jwtToken = localStorage.getItem('token');
        if (jwtToken) {
            getLoggedUser(jwtToken).then(userData => {
                if (userData && userData.username) {
                    setUsername(userData.username);
                    fetchUserProfileImage(userData.id, jwtToken).then(imageUrl => {
                        setProfileImage(imageUrl);
                    });
                    fetchNrOfPosts(userData.id, jwtToken).then(postsCount => {
                        setNrOfPosts(postsCount);
                    });
                    fetchNrOfFriends(userData.id, jwtToken).then(friendsCount => {
                        setNrOfFriends(friendsCount);
                    });
                }
            }).catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    }, []);

    if (!username) {
        return <div>Loading...</div>;
    }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the stored token
            await axios.post('http://localhost:8080/auth/logout', null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.removeItem('token'); // Clear the token from local storage
            navigate('/'); // Redirect to the login page
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (

        <div id="profile" className='profile-header'>
            {profileImage && <img src={profileImage} alt="Profile" className="profile-image"/>}
            <div className="user-info">
                <div className='username-and-actions'>
                    <h1 className='username'>{username}</h1>
                    <input type="submit" className='edit-button' value="Edit Username" onClick={toggleEditWindow}/>
                    
                    {showEditWindow && (
                        <div className="edit-window">
                            {/* Edit window content here */}
                        </div>
                    )}

                    <input onClick={handleLogout} type="submit" className='logout-button' value="Logout" />
                    {/* Include any other buttons you have here */}
                </div>
                <div className='user-stats'>
                    <span className='posts-count'>Posts: {nrOfPosts}</span>
                    <span className='friends-count'> Friends: {nrOfFriends}</span>
                </div>
            </div>
            
        </div>
    );
}

export default ProfileHeader;