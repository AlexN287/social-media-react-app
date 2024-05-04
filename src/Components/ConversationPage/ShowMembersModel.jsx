import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import '../../Styles/Components/ConversationPage/ShowMemberModel.css';
import axios from 'axios';
import eventBus from '../../Helper/EventBus';

async function getLoggedUser(token) {
    try {
        const response = await fetch('http://localhost:8080/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

const fetchConversationMembers = async (conversationId, token) => {
    const response = await fetch(`http://localhost:8080/conversation/${conversationId}/members`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Make sure to include your auth token
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch members');
    return await response.json();
  };
  
  const removeMemberFromConversation = async (conversationId, memberId, token) => {
    try {
      const response = await axios.delete(`http://localhost:8080/conversation/group/${conversationId}/members/remove/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Make sure to include your auth token
        }
      });
      return response.data; // Assuming the response data contains the success message or relevant information
    } catch (error) {
      console.error('Failed to remove member:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
  const ShowMembersModal = ({ isOpen, onClose, conversationId }) => {
    const [members, setMembers] = useState([]);
    const token = localStorage.getItem('token');
    const [memberImages, setMemberImages] = useState({});
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleRemoveMember = async (memberId) => {
      try {
        await removeMemberFromConversation(conversationId, memberId, token);
        setMembers(members.filter(member => member.id !== memberId));
      } catch (error) {
        console.error('Error removing member:', error);
      }
    };

    const handleLeaveConversation = async (conversationId, token, onClose) => {
      try {
        await axios.delete(`http://localhost:8080/conversation/group/${conversationId}/leave`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // This header may not be strictly necessary for DELETE requests, but including it for completeness
          },
        });
        console.log("Left group successfully.");
    
        // Emit an event indicating a conversation has been left
        eventBus.emit('leftConversation', conversationId);
        
        // Close the modal or refresh conversation list as needed
        if (onClose) onClose();
      } catch (error) {
        console.error('Error leaving the group:', error.response ? error.response.data : error.message);
      }
    };

    const fetchUserProfileImage = async (userId) => {
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
    
          const imageUrl = URL.createObjectURL(await response.blob());
          return imageUrl;
        } catch (error) {
          console.error('Error fetching user profile image:', error);
          return null; // Optionally return null or a default image URL in case of error
        }
      };

      useEffect(() => {
        if (token) {
          getLoggedUser(token).then(setLoggedInUser).catch(console.error);
        }
      }, [token]);

      useEffect(() => {
        const fetchMembersAndImages = async () => {
          if (isOpen) {
            const membersData = await fetchConversationMembers(conversationId, token);
            setMembers(membersData);
    
            // Fetch and set profile images for each member
            // membersData.forEach(async (member) => {
            //   const imageUrl = await fetchUserProfileImage(member.id);
            //   setMemberImages(prevImages => ({ ...prevImages, [member.id]: imageUrl }));
            // });
          }
        };
    
        fetchMembersAndImages().catch(error => console.error('Error fetching members and images:', error));
    
        // Clean up images when the modal closes or conversationId changes
        return () => setMemberImages({});
      }, [isOpen, conversationId, token]);
    
  
      return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <h3>Conversation Members</h3>
          <div className='members-list'>
            <ul>
              {members.map(member => (
                <li key={member.id}>
                  <div className='user-data'>
                    {/* {memberImages[member.id] ? (
                      <img src={memberImages[member.id]} alt={member.username} className='user-profile-image'/>
                    ) : (
                      <div className='profile-image-placeholder' />
                    )} */}
                    {member.username}
                  </div>
                  <button onClick={() => {
                // Replace with your logic for handling member removal or leaving the conversation
                member.id === loggedInUser?.id ? handleLeaveConversation(conversationId, token, onClose) : handleRemoveMember(member.id);
              }}>
                {member.id === loggedInUser?.id ? 'Leave' : 'Remove'}
              </button>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      );
    };
    
    export default ShowMembersModal;