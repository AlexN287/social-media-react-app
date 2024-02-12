import React, { useState } from 'react';

import '../../../Styles/Components/ProfilePage/SlidingMenu/ChangePassword.css';

const ChangePassword = ({ onSave, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically validate the passwords and send the new password to your server via an API call
        onSave({ currentPassword, newPassword });
        onClose(); // Close the modal or form after saving
    };

    return (
        <div className="change-password-form">
            <form onSubmit={handleSubmit}>
                <label>
                    Current Password:
                    <input placeholder='Current Password' type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </label>
                <label>
                    New Password:
                    <input placeholder='New Password' type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <button className='submit-button' type="submit">Change Password</button>
                <button className='cancel-button' type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default ChangePassword;