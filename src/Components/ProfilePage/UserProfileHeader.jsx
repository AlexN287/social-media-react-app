import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNrOfPosts } from '../../Services/Posts/PostService';
import { fetchNrOfFriends, checkIfUsersAreFriends } from '../../Services/Friends/FriendsService';
import { fetchUserDetails, getLoggedUser } from '../../Services/User/UserService';
import { checkFriendRequestExists, sendFriendRequest } from '../../Services/Friendship/FriendshipService';
import UserProfileImage from '../Common/ProfileImage';
import Button from '../Common/Button';
import { useWebSocket } from '../../Context/WebSocketContext';
import { checkIfUserIsBlockedBy } from '../../Services/BlockList/BlockListService';

import '../../Styles/Pages/ProfilePage.css';

function UserProfileHeader() {
    const { client, sendMessage } = useWebSocket();

    const { userId } = useParams(); 
    const [userDetails, setUserDetails] = useState({});
    const [nrOfPosts, setNrOfPosts] = useState(0);
    const [nrOfFriends, setNrOfFriends] = useState(0);
    const [profileImage, setProfileImage] = useState(null);
    const [buttonLabel, setButtonLabel] = useState('Add Friend');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        const fetchDetails = async () => {
            if (userId && token) {
                try {
                    const loggedUser = await getLoggedUser(token);  
                    console.log(loggedUser.id);

                    const userDetails = await fetchUserDetails(userId, token);
                    setUserDetails(userDetails);


                    const postsCount = await fetchNrOfPosts(userId, token);
                    setNrOfPosts(postsCount);

                    const friendsCount = await fetchNrOfFriends(userId, token);
                    setNrOfFriends(friendsCount);

                    const areFriends = await checkIfUsersAreFriends(token, loggedUser.id, userId);
                    if (areFriends) {
                        setButtonLabel('Already Friends');
                        setIsButtonDisabled(true);
                    } else {
                        const requestExists = await checkFriendRequestExists(token, loggedUser.id, userId);
                        if (requestExists) {
                            setButtonLabel('Request Sent');
                            setIsButtonDisabled(true);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchDetails();
    }, [userId, token]);

    const handleAddFriend = async () => {
        const loggedUser = await getLoggedUser(token);
        try {
            const response = await sendFriendRequest(token, loggedUser.id, userId);
            console.log('Friend request sent:', response);
            setButtonLabel('Request Sent');
            setIsButtonDisabled(true);

            // Send a notification through WebSocket
            if (client && userId) {
                const notification = {
                    id: loggedUser.id,
                    username: loggedUser.username,
                    email: loggedUser.email,
                    profileImagePath: loggedUser.profileImagePath
                };
                console.log("Udsadadadsefsef: " + userId);
                sendMessage(`/app/notifications/${userId}`, notification);

                
            }
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    

    if (!userDetails.username) {
        return <div>Loading...</div>;
    }

    return (
        <div className='profile-header-main-container'>
            <div id="user-profile" className='profile-header'>
            <UserProfileImage userId={userDetails.id} token={token} size={'large'} />
            <div className="user-info">
                <div className='username-and-actions'>
                    <h1 className='username'>{userDetails.username}</h1>
                    <Button onClick={handleAddFriend} disabled={isButtonDisabled} color='green'>
                        {buttonLabel}
                    </Button>
                </div>
                <div className='user-stats'>
                    <span className='posts-count'>Posts: {nrOfPosts}</span>
                    <span className='friends-count'>Friends: {nrOfFriends}</span>
                </div>
            </div>
        </div>
        </div>
    );
}

export default UserProfileHeader;

