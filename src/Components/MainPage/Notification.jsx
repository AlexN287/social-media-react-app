import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import '../../Styles/Components/MainPage/Notification.css';


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

const Notification = ({ onUpdate }) => {
    const [profileImages, setProfileImages] = useState({});
    const [friendRequests, setFriendRequests] = useState([]);
    const jwtToken = localStorage.getItem('token');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchFriendRequests = async () => {
          try {
            const response = await axios.get('http://localhost:8080/friendship/requests', {
              headers: { 'Authorization': `Bearer ${jwtToken}` }
            });
            setFriendRequests(response.data);
    
            // Fetch the profile image for each friend request sender
            // response.data.forEach(async (request) => {
            //   const imageUrl = await fetchUserProfileImage(request.id, jwtToken);
            //   setProfileImages(prevImages => ({ ...prevImages, [request.id]: imageUrl }));
            // });
          } catch (error) {
            console.error('Error fetching friend requests:', error);
          }
        };
    
        fetchFriendRequests();
      }, [jwtToken]);

      const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };    
    
      const handleAccept = async (senderId) => {
        try {
            const response = await axios.post('http://localhost:8080/friendship/acceptRequest', null, {
                headers: { 'Authorization': `Bearer ${jwtToken}` },
                params: { senderId }
            });

            // Remove the request from the state
            setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== senderId));
            onUpdate(); // Decrement the count after successful accept
            console.log(response.data); // "Friendship request accepted"
            // Optionally, update the UI or state based on the successful response
        } catch (error) {
            console.error('Error accepting friendship request:', error);
            // Handle error (e.g., show an error message)
        }
    };
    
    const handleDecline = async (senderId) => {
        try {
            const response = await axios.patch('http://localhost:8080/friendship/declineRequest', null, {
                headers: { 'Authorization': `Bearer ${jwtToken}` },
                params: { senderId }
            });

            // Remove the request from the state
            setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== senderId));
            onUpdate(); // Decrement the count after successful accept
            console.log(response.data); // "Friendship request declined"
            // Optionally, update the UI or state based on the successful response
        } catch (error) {
            console.error('Error declining friendship request:', error);
            // Handle error (e.g., show an error message)
        }
    };
    


    return (
        <div className="notification-form">
            <div className="friend-requests-container">
                {friendRequests.length > 0 ? (
                    friendRequests.map((request) => (
                        <div key={request.id} className="friend-request">
                            {/* <img src={profileImages[request.id]} alt={request.username} className="profile-image-request" onClick={() => handleUserClick(request.id)}/> */}
                            <span className="username-request" onClick={() => handleUserClick(request.id)} >{request.username}</span>
                            <div className="actions">
                                <button className="accept-button" onClick={() => handleAccept(request.id)}>Accept</button>
                                <button className="decline-button" onClick={() => handleDecline(request.id)}>Decline</button>
                            </div>
                        </div>
                    ))
                ) : (
                    // Display a message when there are no friendship requests
                    <div className="no-notification-message">
                        You have no notifications at this time.
                    </div>
                )
         }
            </div>
        </div>
    );
};

export default Notification;
