import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { fetchFriendRequests, acceptFriendRequest, declineFriendRequest } from "../../Services/Friendship/FriendshipService";
import UserProfileImage from "../Common/ProfileImage";
import { useWebSocket } from "../../Context/WebSocketContext";

import '../../Styles/Components/MainPage/Notification.css';


const Notification = ({ onUpdate, onWebSocket}) => {
const [friendRequests, setFriendRequests] = useState([]);
const jwtToken = localStorage.getItem('token');
const navigate = useNavigate();
const { client } = useWebSocket();

const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('isMenuCollapsed');
    return saved ? JSON.parse(saved) : false; // Convert string back to boolean
  });

useEffect(() => {
    fetchFriendRequests(localStorage.getItem('token')).then(data => {
        setFriendRequests(data);
    }).catch(error => {
        console.error('Error fetching friend requests:', error);
    });

    if (friendRequests.length > 0) {
        console.log("First Friend Request:", friendRequests[0]);
      }
}, []); // Empty dependency array means this runs once on mount.

useEffect(() => {
    if (!client) return;

    const subscription = client.subscribe('/user/queue/notifications', message => {
        console.log("saxsssssssssssssssssssss");
        const notification = JSON.parse(message.body);
        console.log(notification);
        alert(notification.message); // Display notification message
        // Optionally update the state to render the notification in the UI
        //setFriendRequests(prevRequests => [...prevRequests, notification]);
        onWebSocket(); // Callback to handle any additional tasks
    });

    return () => {
        subscription.unsubscribe(); // Clean up subscription
    };
}, [client]); // Dependency on client ensures re-subscription if the client changes.



const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
};  

const handleAccept = async (senderId) => {
    try {
        await acceptFriendRequest(senderId, jwtToken);
        setFriendRequests(prev => prev.filter(request => request.id !== senderId));
        onUpdate();
    } catch (error) {
        console.error('Error accepting friendship request:', error);
    }
};

const handleDecline = async (senderId) => {
    try {
        await declineFriendRequest(senderId, jwtToken);
        setFriendRequests(prev => prev.filter(request => request.id !== senderId));
        onUpdate();
    } catch (error) {
        console.error('Error declining friendship request:', error);
    }
};


return (
    <div className={`notification-form ${isMenuCollapsed ? 'collapsed' : ''}`}>
        <div className="friend-requests-container">
            {friendRequests.length > 0 ? friendRequests.map(request => (
                <div key={request.id} className="friend-request">
                    <UserProfileImage userId={request.id} token={jwtToken} size="small" />
                    <span className="username-request" onClick={() => handleUserClick(request.id)}>{request.username}</span>
                    <div className="actions">
                        <button className="accept-button" onClick={() => handleAccept(request.id)}>Accept</button>
                        <button className="decline-button" onClick={() => handleDecline(request.id)}>Decline</button>
                    </div>
                </div>
            )) : <div className="no-notification-message">You have no notifications at this time.</div>}
        </div>
    </div>
);
};

export default Notification;
