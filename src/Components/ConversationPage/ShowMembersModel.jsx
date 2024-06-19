import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import '../../Styles/Components/ConversationPage/ShowMemberModel.css';

import { getLoggedUser } from '../../Services/User/UserService';
import { fetchConversationMembers } from '../../Services/Conversation/ConversationService';
import { removeMemberFromConversation } from '../../Services/Conversation/ConversationService';
import { handleLeaveConversation } from '../../Services/Conversation/ConversationService';
import UserProfileImage from '../Common/ProfileImage';
  
  const ShowMembersModal = ({ isOpen, onClose, conversationId }) => {
    const [members, setMembers] = useState([]);
    const token = localStorage.getItem('token');
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleRemoveMember = async (memberId) => {
      try {
        await removeMemberFromConversation(conversationId, memberId, token);
        setMembers(members.filter(member => member.id !== memberId));
      } catch (error) {
        console.error('Error removing member:', error);
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
    
          }
        };
    
        fetchMembersAndImages().catch(error => console.error('Error fetching members and images:', error));
    
      }, [isOpen, conversationId, token]);
    
  
      return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <h3>Conversation Members</h3>
          <div className='members-list'>
            <ul>
              {members.map(member => (
                <li key={member.id}>
                  <div className='user-data'>
                    <UserProfileImage userId={member.id} token={token} size={'small'}/>
                    {member.username}
                  </div>
                  <button onClick={() => {
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