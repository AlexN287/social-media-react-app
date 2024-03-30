import React, { useState, useEffect } from 'react';
import '../../Styles/Components/MainPage/Menu.css';
import Notification from './Notification';
import axios from 'axios';

const Menu = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendshipRequestsCount, setFriendshipRequestsCount] = useState(0);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    const saved = localStorage.getItem('isMenuCollapsed');
    return saved ? JSON.parse(saved) : false; // Convert string back to boolean
  });

  // Toggle the visibility of the notifications menu
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const decrementFriendshipRequestCount = () => {
    setFriendshipRequestsCount(prevCount => prevCount - 1);
  };

  // Handler to toggle menu size
  const toggleMenuSize = () => {
    const newState = !isMenuCollapsed;
    setIsMenuCollapsed(newState);
    // Save the new state to localStorage
    localStorage.setItem('isMenuCollapsed', JSON.stringify(newState));
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
    <div className={`menu-main-container ${isMenuCollapsed ? 'collapsed' : ''}`}>
      <nav className={`sidebar-menu ${isMenuCollapsed ? 'collapsed' : ''}`}>
        <h1 className="menu-title">Social Media App</h1>
        <ul className="menu-items">
          <li>
            <a href="/home" onClick={toggleMenuSize}>
              <span className="icon" role="img" aria-label="Home">🏠</span>
              {!isMenuCollapsed && 'Home'}
            </a>
          </li>
          <li className="messages" onClick={toggleMenuSize}>
            <a href="/messages">
              <span className="icon" role="img" aria-label="Messages">✉️</span>
              {!isMenuCollapsed && 'Messages'}
              <span className="notification-count">3</span>
            </a>
          </li>
          <li onClick={toggleNotifications}>
            <button>
              <span className="icon" role="img" aria-label="Notifications">❤️</span>
              {!isMenuCollapsed && `Notifications`}
              <span className="notification-count">{friendshipRequestsCount}</span>
            </button>
          </li>
          <li><a href="/add-post" onClick={toggleMenuSize}><span className="icon" role="img" aria-label="Add a post">➕</span>{!isMenuCollapsed && 'Add a post'}</a></li>
          <li><a href="/myprofile" onClick={toggleMenuSize}><span className="icon" role="img" aria-label="My Profile">👤</span>{!isMenuCollapsed && 'My Profile'}</a></li>
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