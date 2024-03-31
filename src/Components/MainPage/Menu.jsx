import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

import '../../Styles/Components/MainPage/Menu.css';
import Notification from './Notification';
import axios from 'axios';

const Menu = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendshipRequestsCount, setFriendshipRequestsCount] = useState(0);
  const location = useLocation();

  const [isMenuCollapsed, setIsMenuCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('isMenuCollapsed');
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
  const toggleMenuSize = (targetRoute) => {
    // Check if the target route is the same as the current route
    if (location.pathname !== targetRoute) {
      const newState = !isMenuCollapsed;
      setIsMenuCollapsed(newState);
      sessionStorage.setItem('isMenuCollapsed', JSON.stringify(newState));
    }
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
          <li onClick={() => toggleMenuSize('/home')}>
            <Link to="/home">
              <span className="icon" role="img" aria-label="Home">🏠</span>
              {!isMenuCollapsed && 'Home'}
            </Link>
          </li>
          <li onClick={() => toggleMenuSize('/messages')}>
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
          <li onClick={() => toggleMenuSize('/add-post')}>
            <Link to="/add-post">
              <span className="icon" role="img" aria-label="Add a post">➕</span>
              {!isMenuCollapsed && 'Add a post'}
            </Link>
          </li>
          <li onClick={() => toggleMenuSize('/myprofile')}>
            <Link to="/myprofile">
              <span className="icon" role="img" aria-label="My Profile">👤</span>
              {!isMenuCollapsed && 'My Profile'}
            </Link>
          </li>
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