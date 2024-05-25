import React, { useState, useEffect } from 'react';
import { fetchUserProfileImage } from '../../Services/User/UserService';
import '../../Styles/Components/Common/ProfileImage.css';
import { useLoading, setLoading } from '../../Context/LoadingContext';

const UserProfileImage = ({ userId, token, size }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        async function loadImage() {
            try {
                setLoading(true);
                const imgSrc = await fetchUserProfileImage(userId, token);
                setImageUrl(imgSrc);
            } catch (error) {
                console.error('Failed to load user image:', error);
                setImageUrl(null);
            } finally {
                setLoading(false);
            }
        }

        if (userId && token) {
            loadImage();
        }
    }, [userId, token, setLoading]);

    let imageClass = 'profile-image-small';
    if (size === 'large') {
        imageClass = 'profile-image-large';
    } else if (size === 'medium') {
        imageClass = 'profile-image-medium';
    }

    return (
        <div className={imageClass}>
            {
                imageUrl ? (
                    <img src={imageUrl} alt="User Profile" className={imageClass} />
                ) : (
                    <p>No image available</p>
                )
            }
        </div>
    );
};

export default UserProfileImage;
