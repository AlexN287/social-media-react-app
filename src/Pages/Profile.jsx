import React from 'react';
import '../Styles/Pages/ProfilePage.css';
import ProfileHeader from '../Components/ProfilePage/ProfileHeader';
import Menu from '../Components/MainPage/Menu';

function ProfilePage() {
    return (
        <div id="profile-page" className='profile-page'>
            <ProfileHeader/>
            <Menu/>
        </div>
    );
}

export default ProfilePage;

