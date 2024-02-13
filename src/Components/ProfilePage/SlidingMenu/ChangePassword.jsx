import React, { useState } from 'react';
import axios from 'axios';

import '../../../Styles/Components/ProfilePage/SlidingMenu/ChangePassword.css';

const ChangePassword = ({ onSave, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const jwtToken = localStorage.getItem('token'); // Retrieve the JWT token

        const passwordChangeRequest = {
            newPassword: newPassword,
            oldPassword: currentPassword
        };

        try {
            const response = await axios.post('http://localhost:8080/user/changePassword', passwordChangeRequest, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
            });

            setMessage(response.data); // Set success message
            onClose(); // Optionally close the form/modal if needed
        } catch (error) {
            console.error('Error changing password:', error.response ? error.response.data : error);
            setMessage(error.response && error.response.data ? error.response.data : 'An error occurred while changing the password.'); // Set error message
        }
    };


    return (
        <div className="change-password-form">
            <form onSubmit={handleSubmit}>

                <input placeholder='Current Password' type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                <input placeholder='New Password' type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                <button className='submit-button' type="submit">Change Password</button>
                <button className='cancel-button' type="button" onClick={onClose}>Cancel</button>
            </form>
            {message && <div className="message">{message}</div>} {/* Display the message */}
        </div>
    );

};

export default ChangePassword;