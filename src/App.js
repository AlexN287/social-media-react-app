import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './Pages/Authentication/SignIn';
import SignUp from './Pages/Authentication/SignUp';
import MainPage from './Pages/MainPage';
import ProfilePage from './Pages/Profile';
import UserProfile from './Pages/UserProfile';


function App() {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/myprofile" element={<ProfilePage/>} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes> 
    </Router>
    {/* <ChatPage/> */}
    </div>
  );
}

export default App;
