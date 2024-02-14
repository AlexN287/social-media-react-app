import React, { useState, useEffect } from 'react';
import axios from 'axios';


import '../../../Styles/Components/ProfilePage/SlidingMenu/EditProfile.css';

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

async function fetchUserProfileImage(userId, token) {
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

        return URL.createObjectURL(await response.blob());
    } catch (error) {
        console.error('Error fetching profile image:', error);
    }
}

const EditProfile = ({ onSave, onClose }) => {
    const [username, setUsername] = useState('');
    const [initialUsername, setInitialUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token'); // Replace this with your token retrieval method if different
        if (token) {
            getLoggedUser(token).then(userData => {
                if (userData && userData.username) {
                    setInitialUsername(userData.username);
                    setUsername(userData.username);
                    fetchUserProfileImage(userData.id, token).then(imageUrl => {
                        setProfileImage(imageUrl);
                        setProfileImagePreview(imageUrl);
                    }).catch(error => console.error('Failed to load profile image:', error));
                }
            }).catch(error => console.error('Failed to load user data:', error));
        }
    }, []); // The empty array ensures this effect runs only once when the component mounts

    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem('token'); // Retrieve the JWT token
    
        // Update the username
        if (username !== initialUsername){
            try {
                const response = await axios.patch('http://localhost:8080/user/editUsername', null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: { newUsername: username }
                });
    
                localStorage.setItem('token', response.data);
                token = localStorage.getItem('token');
    
                setMessage("Changes saved successfully.");
            } catch (error) {
                console.error('Error updating username:', error);
                setErrorMessage('Failed to update username.');
                return; // Stop further execution in case of error
            }    
        }
        
        // Update the profile image if a new one has been selected
        if (typeof profileImage === 'object') { // Check if profileImage is a File object
            const formData = new FormData();
            formData.append('file', profileImage);
    
            try {
                const userResponse = await axios.get('http://localhost:8080/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const userId = userResponse.data.id;
    
                await axios.post(`http://localhost:8080/user/${userId}/uploadProfileImage`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setMessage("Changes saved successfully.");
            } catch (error) {
                console.error('Error uploading profile image:', error);
                setErrorMessage('Failed to upload profile image.');
            }
        }
    
        //onClose();
        onSave(username, profileImagePreview);
    };
    

    const handleFileChange = (e) => {
        // Create a URL for the selected file to preview it
        const fileUrl = URL.createObjectURL(e.target.files[0]);
        setProfileImagePreview(fileUrl);
        setProfileImage(e.target.files[0]);
    };

    return (
        <div className="edit-profile-form">
            <form onSubmit={handleSubmit}>
                <label>
                    {username}
                </label>
                {profileImagePreview && <img src={profileImagePreview} alt="Profile" className='profile-image' />} {/* Display the profile image if available */}
                <label>
                    Username:
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>

                <label>
                    Profile Image:
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>

                <button className='submit-button' type="submit">Save Changes</button>
                <button className='cancel-button' type="button" onClick={onClose}>Cancel</button>
            </form>

            {message && <div className="message">{message}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default EditProfile;