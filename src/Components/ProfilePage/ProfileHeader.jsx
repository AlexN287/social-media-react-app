import React, { useState, useEffect } from 'react';
import '../../Styles/Components/ProfilePage/ProfileHeader.css';
import EditProfile from './SlidingMenu/EditProfile';
import ChangePassword from './SlidingMenu/ChangePassword';
import FriendsSettings from './SlidingMenu/FriendsSettings';
import BlockedUsers from './SlidingMenu/BlockedUsers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {fetchNrOfFriends} from '../../Services/Friends/FriendsService';
import { getLoggedUser } from '../../Services/User/UserService';
import { fetchUserProfileImage } from '../../Services/User/UserService';
import { fetchNrOfPosts } from '../../Services/Posts/PostService';
import LoadingComponent from '../Common/LoadingComponent';
import UserProfileImage from '../Common/ProfileImage';
import Button from '../Common/Button';

function ProfileHeader() {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [nrOfPosts, setNrOfPosts] = useState(0);
    const [nrOfFriends, setNrOfFriends] = useState(0);
    const [showSlidingWindow, setShowSlidingWindow] = useState(false);
    const [showActionWindow, setShowActionWindow] = useState(false); // State for the new sliding window
    const [activeAction, setActiveAction] = useState(''); // What action to show in the new window
    const navigate = useNavigate();
    const toggleSlidingWindow = () => setShowSlidingWindow(!showSlidingWindow);
    const jwtToken = localStorage.getItem('token');

    useEffect(() => {
        
        if (jwtToken) {
            getLoggedUser(jwtToken).then(userData => {
                if (userData && userData.username) {
                    setUsername(userData.username);
                    setUserId(userData.id);
                    // fetchUserProfileImage(userData.id, jwtToken).then(imageUrl => {
                    //     setProfileImage(imageUrl);
                    // });
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
        return <LoadingComponent/>;
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

        <div className='profile-header-main-container'>
            <div id="profile" className='profile-header'>
                {/* {profileImage && <img src={profileImage} alt="Profile" className="profile-image"/>} */}
                <UserProfileImage userId={userId} token={jwtToken} size={'large'}/>
                <div className="user-info">
                    <div className='username-and-actions'>
                        <h1 className='username'>{username}</h1>
                        <Button color="green" onClick={toggleSlidingWindow}>Edit profile</Button>
                        <Button color="green" onClick={handleLogout}>Logout</Button>
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