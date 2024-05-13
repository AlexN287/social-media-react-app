import React from 'react';
import SearchBar from '../Components/MainPage/SearchBar';
import Menu from '../Components/MainPage/Menu';
import PostContainer from '../Components/Posts/PostContainer';
import '../Styles/Pages/MainPage.css';
import { WebSocketProvider } from '../Context/WebSocketContext';
import ConnectedFriendsComponent from '../Components/MainPage/ActiveUsers';

const MainPage = () => {
console.log('recasdcdadcesad');

  return (
    <div className="main-page-container">
      <div className="menu-container">
        <Menu />
      </div>
      <div className="right-container">
        <div className="post-and-search-container">
          <div className="search-bar-container">
            <SearchBar />
          </div>
          <div className="post-container">
            <PostContainer />
          </div>
        </div>
        <div className="connected-friends-container">
          <ConnectedFriendsComponent />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
