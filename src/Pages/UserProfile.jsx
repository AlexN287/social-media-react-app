import React from 'react';
import { useParams } from 'react-router-dom';

import Menu from '../Components/MainPage/Menu';
import UserProfileHeader from '../Components/ProfilePage/UserProfileHeader';

function UserProfile() {
    let { userId } = useParams();

    return (
        <div id="user-profile-page" className='user-profile-page'>
            <UserProfileHeader/>
            <Menu/>
        </div>
    );
}

export default UserProfile;