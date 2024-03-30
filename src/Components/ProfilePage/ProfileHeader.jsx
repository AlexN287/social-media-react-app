import React, { useState, useEffect } from 'react';
import '../../Styles/Components/ProfilePage/ProfileHeader.css';
import EditProfile from './SlidingMenu/EditProfile';
import ChangePassword from './SlidingMenu/ChangePassword';
import FriendsSettings from './SlidingMenu/FriendsSettings';
import BlockedUsers from './SlidingMenu/BlockedUsers';
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
        console.log('Nr of friends');
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
    const [showSlidingWindow, setShowSlidingWindow] = useState(false);
    const [showActionWindow, setShowActionWindow] = useState(false); // State for the new sliding window
    const [activeAction, setActiveAction] = useState(''); // What action to show in the new window
    const navigate = useNavigate();
    const toggleSlidingWindow = () => setShowSlidingWindow(!showSlidingWindow);

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

    const handleMenuClick = (menu) => {
        setActiveAction(menu); // Set which action is currently active
        setShowActionWindow(true); // Show the new action sliding window
    };

    // Function to close the action sliding window
    const closeActionWindow = () => {
        setShowActionWindow(false);
        setShowSlidingWindow(false);
        setActiveAction('');
    };

    const updateProfile = (updatedUsername, updatedProfileImage) => {
        if (updatedUsername) {
            setUsername(updatedUsername);
        }
        if (updatedProfileImage) {
            setProfileImage(updatedProfileImage);
        }
    };

    const updateFriendsNr = () => {
        setNrOfFriends(nrOfFriends - 1);
    }

    // Determine which component to render based on the active window
    const renderActionComponent = () => {
        switch (activeAction) {
            case 'editProfile':
                return <EditProfile onSave={updateProfile} onClose={closeActionWindow} />;
            case 'changePassword':
                return <ChangePassword onClose={closeActionWindow} />;
            case 'friendsSettings':
                return <FriendsSettings onSave = {updateFriendsNr} onClose={closeActionWindow}/>
            case 'blockedUsers':
                return <BlockedUsers onClose={closeActionWindow} />
            default:
                return null;
        }
    };

    return (

        <div className='main-container'>
            <div id="profile" className='profile-header'>
                {profileImage && <img src={profileImage} alt="Profile" className="profile-image"/>}
                <div className="user-info">
                    <div className='username-and-actions'>
                        <h1 className='username'>{username}</h1>
                        <input type="submit" className='edit-button' value="Edit Profile" onClick={toggleSlidingWindow} />

                        <input onClick={handleLogout} type="submit" className='logout-button' value="Logout" />
                        {/* Include any other buttons you have here */}
                    </div>
                    <div className='user-stats'>
                        <span className='posts-count'>Posts: {nrOfPosts}</span>
                        <span className='friends-count'> Friends: {nrOfFriends}</span>
                    </div>
                </div>

            </div>

            {showSlidingWindow && (
                <div className='sliding-window'>
                    <div className="sliding-menu">
                        <button onClick={() => handleMenuClick('editProfile')} className="menu-button">Edit Profile</button>
                        <button onClick={() => handleMenuClick('changePassword')} className="menu-button">Change Password</button>
                        <button onClick={() => handleMenuClick('friendsSettings')} className="menu-button">Friends Settings</button>
                        <button onClick={() => handleMenuClick('blockedUsers')} className="menu-button">Blocked Users</button>
                    </div>


                    
                </div>
            )}

            {showActionWindow && (
                <div className='action-window'>
                    {/* Render the component based on the active action */}
                    {renderActionComponent()}
                </div>
            )}

        </div>

    );
}

export default ProfileHeader;