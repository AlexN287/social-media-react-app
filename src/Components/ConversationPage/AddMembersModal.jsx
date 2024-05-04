import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import '../../Styles/Components/ConversationPage/AddMembersModal.css';

const AddMembersModal = ({ isOpen, onClose, conversationId, token}) => {
    const [friends, setFriends] = useState([]);
    const [friendImages, setFriendImages] = useState({});
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        setIsLoading(true);
        fetch(`http://localhost:8080/conversation/${conversationId}/friends-not-in-conversation`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(res => res.json())
        .then(async data => {
          setFriends(data);
          // Reset friend images state for the new list of friends
          setFriendImages({});
  
          // Fetch profile images for each friend
          // const imagePromises = data.map(friend =>
          //   fetchUserProfileImage(friend.id, token).then(imageUrl => {
          //     setFriendImages(prev => ({ ...prev, [friend.id]: imageUrl }));
          //   })
          // );
  
          // await Promise.all(imagePromises);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch friends:', err);
          setIsLoading(false);
        });
      }
    }, [isOpen, conversationId, token]);
  
    // Example fetchUserProfileImage function (adjust the URL as needed)
    const fetchUserProfileImage = async (userId, token) => {
      try {
        const response = await fetch(`http://localhost:8080/user/${userId}/loadProfileImage`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const imageUrl = URL.createObjectURL(await response.blob());
        return imageUrl;
      } catch (error) {
        console.error('Error fetching user profile image:', error);
        return null; // Fallback image or null
      }
    };
  
  
    const handleAddMember = (userId) => {
      fetch(`http://localhost:8080/conversation/group/${conversationId}/members/add?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.ok) {
            setFriends(friends.filter(friend => friend.id !== userId));
          } else {
            console.log('Failed to add user to the group');
          }
        })
        .catch(error => {
          console.error('Error adding user to the group:', error);
        });
    };
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <h3>Add Members</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : friends.length === 0 ? (
          <p>No friends available to add to this conversation.</p>
        ) : (
          <div className='members-list'>
            <ul>
              {friends.map(friend => (
                <li key={friend.id}>
                  <div className='user-data'>
                  {/* {friendImages[friend.id] ? (
                    <img src={friendImages[friend.id]} alt={friend.username} className='friend-profile-image' />
                  ) : (
                    <div className='profile-image-placeholder'></div>
                  )}
                  {friend.username} */}
                  
                  </div>
                  <button className='add-member2' onClick={() => handleAddMember(friend.id)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    );
  };
  
  export default AddMembersModal;
  
