import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import Menu from '../Components/MainPage/Menu';
import UserProfileHeader from '../Components/ProfilePage/UserProfileHeader';
import PostContainer from '../Components/Posts/PostContainer';
import '../Styles/Pages/ProfilePage.css';

import { getLoggedUser } from '../Services/User/UserService';
import { checkIfUserIsBlockedBy } from '../Services/BlockList/BlockListService';

function UserProfile() {
    const { userId } = useParams();
    const [isBlocked, setIsBlocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBlockedStatus = async () => {
            try {
                const loggedUser = await getLoggedUser(token);
                const blocked = await checkIfUserIsBlockedBy(token, userId);
                setIsBlocked(blocked);
            } catch (error) {
                console.error('Error checking blocked status:', error);
                setError('Failed to check blocked status.');
            } finally {
                setLoading(false);
            }
        };

        if (token && userId) {
            fetchBlockedStatus();
        }
    }, [token, userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (isBlocked) {
        return (
            <div id="profile-page" className='profile-page'>
                <Menu />
                <div className='profile-page-content'>
                    <h2>You are blocked by this user and cannot view their profile.</h2>
                </div>
            </div>
        );
    }


    return (
        <div id="profile-page" className='profile-page'>
            <Menu />
            <div className='profile-page-content'>
                <div className='profile-header-component'>
                    <UserProfileHeader />
                </div>

                <PostContainer />

            </div>

        </div>
    );
}

export default UserProfile;