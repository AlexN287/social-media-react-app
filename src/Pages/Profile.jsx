import React from 'react';
import '../Styles/Pages/ProfilePage.css';
import ProfileHeader from '../Components/ProfilePage/ProfileHeader';
import Menu from '../Components/MainPage/Menu';
import PostContainer from '../Components/Posts/PostContainer';

function ProfilePage() {
    return (
        <div id="profile-page" className='profile-page'>
            <Menu />
            <div className='profile-page-content'>
                <div className='profile-header-component'>
                    <ProfileHeader />
                </div>

                <PostContainer />

            </div>

        </div>
    );
}

export default ProfilePage;

