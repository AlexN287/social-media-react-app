import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

import '../../Styles/Components/MainPage/Menu.css';
import Notification from './Notification';
import AddPostModal from '../Posts/AddPostModal';
import { useWebSocket } from '../../Context/WebSocketContext';
import axios from 'axios';

const Menu = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendshipRequestsCount, setFriendshipRequestsCount] = useState(0);
  const location = useLocation();
  const { client } = useWebSocket();

  const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('isMenuCollapsed');
    return saved ? JSON.parse(saved) : false; // Convert string back to boolean
  });

  const [isAddPostModalOpen, setAddPostModalOpen] = useState(false);

  // Toggle the visibility of the notifications menu
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const incrementFriendshipRequestCount = () => {
    setFriendshipRequestsCount(prevCount => prevCount + 1);
  };

  const decrementFriendshipRequestCount = () => {
    setFriendshipRequestsCount(prevCount => Math.max(0, prevCount - 1));
  };

  useEffect(() => {
    const fetchFriendshipRequestsCount = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/friendship/requestsNr', {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        setFriendshipRequestsCount(response.data); // Update the state with the fetched count
      } catch (error) {
        console.error('Error fetching number of friendship requests:', error);
      }
    };

    fetchFriendshipRequestsCount();

    if (location.pathname === '/messages') {
      setIsMenuCollapsed(true); // Or false, depending on your desired behavior
      sessionStorage.setItem('isMenuCollapsed', 'true');
    } else {
      setIsMenuCollapsed(false); // This could also be a dynamic value or the opposite of your choice above
      sessionStorage.setItem('isMenuCollapsed', 'false');
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   console.log(client);
  //   if (client) {
  //     const subscription = client.subscribe('/app/updateFriendshipRequestsCount', message => {
  //       const notification = JSON.parse(message.body);
  //       alert(notification.message);  // Show notification message
  //       incrementFriendshipRequestCount();  // Increment the count upon receiving a new request
  //     });
  
  //     return () => subscription.unsubscribe();
  //   }
  // }, [client]);
  

  return (
    <div className={`menu-main-container ${isMenuCollapsed ? 'collapsed' : ''}`}>
      <nav className={`sidebar-menu ${isMenuCollapsed ? 'collapsed' : ''}`}>
        <h1 className="menu-title">Social Media App</h1>
        <ul className="menu-items">
          <li>
            <Link to="/home">
              <span className="icon" role="img" aria-label="Home">🏠</span>
              {!isMenuCollapsed && 'Home'}
            </Link>
          </li>
          <li>
            <Link to="/messages">
              <span className="icon" role="img" aria-label="Messages">✉️</span>
              {!isMenuCollapsed && 'Messages'}
              <span className="notification-count">3</span>
            </Link>
          </li>
          <li onClick={toggleNotifications}>
            <button>
              <span className="icon" role="img" aria-label="Notifications">❤️</span>
              {!isMenuCollapsed && `Notifications`}
              <span className="notification-count">{friendshipRequestsCount}</span>
            </button>
          </li>
          <li>
            <button onClick={() => setAddPostModalOpen(true)}>  {/* Change to a button to manage modal */}
              <span className="icon" role="img" aria-label="Add a post">➕</span>
              {!isMenuCollapsed && 'Add a post'}
            </button>
          </li>
          <li>
            <Link to="/myprofile">
              <span className="icon" role="img" aria-label="My Profile">👤</span>
              {!isMenuCollapsed && 'My Profile'}
            </Link>
          </li>
        </ul>
      </nav>

       {/* Render the AddPostModal here */}
       <AddPostModal isOpen={isAddPostModalOpen} onClose={() => setAddPostModalOpen(false)} />

      {showNotifications && (
        <div className="notifications-menu">
          <Notification onUpdate={decrementFriendshipRequestCount} onWebSocket={incrementFriendshipRequestCount}/>
        </div>
      )}
    </div>
  );
};

export default Menu;