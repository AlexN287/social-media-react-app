import React, { useState, useEffect } from 'react';
import '../../Styles/Components/MainPage/Menu.css';
import Notification from './Notification';
import axios from 'axios';

const Menu = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendshipRequestsCount, setFriendshipRequestsCount] = useState(0);

  // Toggle the visibility of the notifications menu
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const decrementFriendshipRequestCount = () => {
    setFriendshipRequestsCount(prevCount => prevCount - 1);
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
  }, []);


  return (
    <div className='menu-main-container'>
      <nav className="sidebar-menu">
        <h1 className="menu-title">Social Media App</h1>
        <ul className="menu-items">
          <li>
            <a href="/home">
              <span className="icon" role="img" aria-label="Home">🏠</span>
              Home
            </a>
          </li>
          <li className="messages">
            <a href="/home">
              <span className="icon" role="img" aria-label="Messages">✉️</span>
              Messages<span className="notification-count">3</span>
            </a>
          </li>
          <li>
            <button onClick={toggleNotifications}>
              <span className="icon" role="img" aria-label="Notifications">❤️</span>
              Notifications
              <span className="notification-count">{friendshipRequestsCount}</span>
            </button>
          </li>
          <li><a href="/home"><span className="icon" role="img" aria-label="Add a post">➕</span>Add a post</a></li>
          <li><a href="/myprofile"><span className="icon" role="img" aria-label="My Profile">👤</span>My Profile</a></li>
        </ul>
      </nav>

      {showNotifications && (
        <div className="notifications-menu">
          <Notification onUpdate={decrementFriendshipRequestCount} />
        </div>
      )}
    </div>

  );

};
export default Menu;
