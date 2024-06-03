import React from "react";
import UserProfileImage from "../Common/ProfileImage";
import MessageBanner from "../Common/MessageBanner";
import Button from "../Common/Button";

import '../../Styles/Components/Roles/AdminPage/UserItem.css';

const ROLES = ['USER', 'MODERATOR', 'ADMIN'];

const UserItem = ({ user, handleRoleChange, handleSubmit, message, handleBannerClose }) => {
    return (
      <div key={user.id} className="user-row">
        <div className='change-roles-container'>
          <div className='admin-page-user-info'>
            <UserProfileImage userId={user.id} token={localStorage.getItem('token')} size={'medium'} />
            <div className="current-roles">
              <h3>{user.username}</h3>
              <strong>Current Roles:</strong> {user.roles.join(', ')}
            </div>
          </div>
  
          <div className="roles-select">
            <label>
              Select New Roles:
              <select
                multiple
                value={user.roles}
                onChange={(e) => handleRoleChange(user.id, Array.from(e.target.selectedOptions, option => option.value))}
              >
                {ROLES.map(role => (
                  <option key={role} value={role} disabled={role === 'ROLE_USER'}>{role}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
  
        <div className="button-container">
          <Button color={'green'} onClick={() => handleSubmit(user.id, user.roles)}>Submit</Button>
        </div>
  
        {message && (
          <MessageBanner
            message={message.text}
            type={message.type}
            onClose={() => handleBannerClose(user.id)}
          />
        )}
      </div>
    );
  };
  
  export default UserItem;