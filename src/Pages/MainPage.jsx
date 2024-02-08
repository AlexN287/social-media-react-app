import React from 'react';
import SearchBar from '../Components/MainPage/SearchBar';
import Menu from '../Components/MainPage/Menu';

const MainPage = () => {
  return (
    <div className="main-container">
      <header className="main-header">
        <SearchBar/>
        <Menu/>
      </header>
      <div className="content">
      </div>
    </div>
  );
};

export default MainPage;
