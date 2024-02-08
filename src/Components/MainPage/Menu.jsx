import React from 'react';
import '../../Styles/Components/MainPage/Menu.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Menu = () => {
  return (
    <nav className="sidebar-menu">
      <h1 className="menu-title">Social Media App</h1>
      <ul className="menu-items">
        <li><a href="/home"><span className="icon">🏠</span>Home</a></li>
        <li className="messages">
          <a href="#"><span className="icon">✉️</span>Messages<span className="message-count">3</span></a>
        </li>
        <li><a href="#"><span className="icon">❤️</span>Notifications</a></li>
        <li><a href="#"><span className="icon">➕</span>Add a post</a></li>
        <li><a href="/myprofile"><span className="icon">👤</span>My Profile</a></li>
      </ul>
    </nav>
  );
};
export default Menu;
