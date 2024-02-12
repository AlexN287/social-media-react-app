import React, { useState } from 'react';

import '../../../Styles/Components/ProfilePage/SlidingMenu/EditProfile.css';

const EditProfile = ({ onSave, onClose }) => {
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send this data to your server via an API call
        onSave({ username, profileImage });
        onClose(); // Close the modal or form after saving
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    return (
        <div className="edit-profile-window">
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Profile Image:
                    <input type="file" onChange={handleFileChange} />
                </label>
                <button className='submit button' type="submit">Save Changes</button>
                <button className='cancel-button' type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default EditProfile;