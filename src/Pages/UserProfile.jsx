import React from 'react';
// import { useParams } from 'react-router-dom';

import Menu from '../Components/MainPage/Menu';
import UserProfileHeader from '../Components/ProfilePage/UserProfileHeader';
import PostContainer from '../Components/Posts/PostContainer';
import '../Styles/Pages/ProfilePage.css';

function UserProfile() {
    // let { userId } = useParams();

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