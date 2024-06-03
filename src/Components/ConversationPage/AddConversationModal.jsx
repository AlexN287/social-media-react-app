import React from 'react';
import Modal from '../Common/Modal';
import '../../Styles/Components/ConversationPage/AddConversationModal.css';

const AddConversationModal = ({
  isOpen,
  onClose,
  friends,
  selectedFriendIds,
  toggleFriendSelection,
  groupName,
  setGroupName,
  groupImage,
  setGroupImage,
  handleSubmit,
  creationError
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='modal-add-conv-header'>Select Friends</h2>
      <ul className='modal-add-conv-ul'>
        {friends.map(friend => (
          <li className='modal-add-conv-li' key={friend.id} onClick={() => toggleFriendSelection(friend.id)}>
            {friend.username}
            <span className={`selection-circle ${selectedFriendIds.includes(friend.id) ? 'selected' : ''}`}>
              {selectedFriendIds.includes(friend.id) && '✓'}
            </span>
          </li>
        ))}
      </ul>

      {selectedFriendIds.length > 1 && (
        <>
          <input
            className='group-name'
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
          <input
            className='group-image'
            type="file"
            accept="image/*"
            onChange={e => setGroupImage(e.target.files[0])}
          />
        </>
      )}

      <button className='create-conversation-btn' onClick={handleSubmit}>Add Conversation</button>

      {creationError && (
        <div className="creation-error-message">
          {creationError}
        </div>
      )}
    </Modal>
  );
};

export default AddConversationModal;
