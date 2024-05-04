import React from 'react';
import '../Styles/Pages/ProfilePage.css';
import ProfileHeader from '../Components/ProfilePage/ProfileHeader';
import Menu from '../Components/MainPage/Menu';
import PostContainer from '../Components/Posts/PostContainer';

function ProfilePage() {
    return (
        <div id="profile-page" className='profile-page'>
            <ProfileHeader/>
            {/* <div className='profile-page-posts'>
                <PostContainer/>
            </div> */}
            <Menu/>
        </div>
    );
}

export default ProfilePage;

