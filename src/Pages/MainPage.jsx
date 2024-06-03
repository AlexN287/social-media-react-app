import React, {useState, useEffect} from 'react';
import SearchBar from '../Components/MainPage/SearchBar';
import Menu from '../Components/MainPage/Menu';
import PostContainer from '../Components/Posts/PostContainer';
import '../Styles/Pages/MainPage.css';

import ConnectedFriendsComponent from '../Components/MainPage/ActiveUsers';
import { searchUsersByUsername } from '../Services/Search/SearchService';
import useSwipe from '../Hooks/Common/useSwipe';

const MainPage = () => {
  const [showFriends, setShowFriends] = useState(false);

  const handleSwipeLeft = () => {
    setShowFriends(true); // Swipe left action
  };

  const handleSwipeRight = () => {
    setShowFriends(false); // Swipe right action
  };

  useSwipe(handleSwipeLeft, handleSwipeRight);

  return (
    <div className="main-page-container">
      <div className="menu-container">
        <Menu />
      </div>
      <div className="right-container">
        <div className="post-and-search-container">
          <div className="search-bar-container">
            <SearchBar searchFunction={searchUsersByUsername} showResultsContainer={true}/>
          </div>
          <div className="post-container">
            <PostContainer />
          </div>
        </div>
        <div className={`connected-friends-container ${showFriends ? 'show' : ''}`}>
          <ConnectedFriendsComponent />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
