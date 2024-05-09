import React from 'react';
import SearchBar from '../Components/MainPage/SearchBar';
import Menu from '../Components/MainPage/Menu';
import PostContainer from '../Components/Posts/PostContainer';
import '../Styles/Pages/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page-container">
      <div className="menu-container">
        <Menu/>
      </div>
      <div className="content-container">
        <SearchBar/>
        <PostContainer/>
      </div>
    </div>
  );
};

export default MainPage;
