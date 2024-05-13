import React, { useState, useEffect } from 'react';
import { fetchConnectedFriends } from '../../Services/User/UserService';
import UserProfileImage from '../Common/ProfileImage';

import '../../Styles/Components/MainPage/ActiveUsers.css';

const ConnectedFriendsComponent = () => {
    const [connectedFriends, setConnectedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
      fetchConnectedFriends(token).then(data => {
        setConnectedFriends(data);
        setLoading(false);
    }).catch(error => {
        setError(error.message);
        setLoading(false);
    });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    if (connectedFriends.length === 0) return <div className="no-active-friends-message">No active friends to display.</div>;

    return (
      <div className='connected-users-container'>
          <h2>Connected Friends</h2>
          <ul className='connected-users-ul'>
              {connectedFriends.map(friend => (
                  <li key={friend.id} className="active-user-item">
                      <UserProfileImage userId={friend.id} token={token} size="small" />
                      <span className="active-user-username">{friend.username}</span>
                      <span className="online-indicator"></span> {/* Green circle indicator */}
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default ConnectedFriendsComponent;
