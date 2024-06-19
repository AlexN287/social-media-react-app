import React, { useState } from 'react';
import axios from 'axios';

import '../../../Styles/Components/ProfilePage/SlidingMenu/ChangePassword.css';

import { changeUserPassword } from '../../../Services/User/UserService';

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
            const responseMessage = await changeUserPassword(jwtToken, passwordChangeRequest);

            setMessage(responseMessage); // Set success message
            onSave(); // Call onSave callback if needed
            onClose(); // Optionally close the form/modal if needed
        } catch (error) {
            setMessage(error.message); // Set error message
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