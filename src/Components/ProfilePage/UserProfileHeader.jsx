import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../../Styles/Components/ProfilePage/UserProfileHeader.css';

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

async function fetchUserDetails(userId, token) {
    const url = `http://localhost:8080/user/${userId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Assuming JWT token is used for authorization
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userDetails = await response.json();
        return userDetails;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; // Rethrow the error if you want to handle it in the calling function
    }
}

// async function fetchUserProfileImage(userId, token) {
//     try {
//         const response = await fetch(`http://localhost:8080/user/${userId}/loadProfileImage`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         return URL.createObjectURL(await response.blob());
//     } catch (error) {
//         console.error('Error fetching profile image:', error);
//     }
// }

async function checkIfUsersAreFriends(token, userId1, userId2) {
    const url = `http://localhost:8080/friendsList/checkFriendship?userId1=${userId1}&userId2=${userId2}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json(); // Returns true if they are friends
}

async function checkFriendRequestExists(token, senderId, receiverId) {
    const url = `http://localhost:8080/friendship/exists/${senderId}/${receiverId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result; // Returns true if a friend request already exists
}


function UserProfileHeader() {
    const { userId } = useParams(); // This assumes you're using React Router and have a route setup to capture userId
    const [userDetails, setUserDetails] = useState({});
    const [nrOfPosts, setNrOfPosts] = useState(0);
    const [nrOfFriends, setNrOfFriends] = useState(0);
    // const [profileImage, setProfileImage] = useState(null);
    const [buttonLabel, setButtonLabel] = useState('Add Friend');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage

    useEffect(() => {
        const fetchDetails = async () => {
            if (userId && token) {
                try {
                    const loggedUser = await getLoggedUser(token);  // This gets the logged-in user's details
                    console.log(loggedUser.id);
                    const userDetails = await fetchUserDetails(userId, token);
                    setUserDetails(userDetails);

                    // const imageUrl = await fetchUserProfileImage(userId, token);
                    // setProfileImage(imageUrl);

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

    async function sendFriendRequest(token, senderId, receiverId) {
        const url = `http://localhost:8080/friendship/sendRequest`; // Update with your actual endpoint
        const body = {
            sender: { id: senderId },
            receiver: { id: receiverId },
            status: "PENDING" // Assuming you have a status field to indicate the request state
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error; // Rethrow or handle as needed
        }
    }    

    const handleAddFriend = async () => {
        const loggedUser = await getLoggedUser(token); // Assuming you already have this function
    try {
        const response = await sendFriendRequest(token, loggedUser.id, userId);
        console.log('Friend request sent:', response);
        setButtonLabel('Request Sent');
        setIsButtonDisabled(true);
    } catch (error) {
        console.error('Failed to send friend request:', error);
    }
    };

    if (!userDetails.username) {
        return <div>Loading...</div>;
    }

    return (
        <div id="user-profile" className='profile-header'>
            {/* {profileImage && <img src={profileImage} alt="Profile" className="profile-image"/>} */}
            <div className="user-info">
                <div className='username-and-actions'>
                    <h1 className='username'>{userDetails.username}</h1>
                    <button onClick={handleAddFriend} disabled={isButtonDisabled} className='add-friend-button'>
                        {buttonLabel}
                    </button>
                </div>
                <div className='user-stats'>
                    <span className='posts-count'>Posts: {nrOfPosts}</span>
                    <span className='friends-count'>Friends: {nrOfFriends}</span>
                </div>
            </div>
        </div>
    );
}

export default UserProfileHeader;

