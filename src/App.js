// import logo from './logo.svg';
import './App.css';
// import React, { useState } from 'react';
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './Pages/Authentication/SignIn';
import SignUp from './Pages/Authentication/SignUp';
import MainPage from './Pages/MainPage';
import ProfilePage from './Pages/Profile';
import UserProfile from './Pages/UserProfile';
import ChatPage from './Pages/ConversationPage';
import { AuthProvider } from './Context/AuthContext';
import { LoadingProvider } from './Context/LoadingContext';
import { WebSocketProvider } from './Context/WebSocketContext';
import VideoCall from './Components/ConversationPage/VideoCall';
import { getLoggedUser } from './Services/User/UserService';
import CallInvitationProvider from './Context/CallInvitationContext';


function App() {
  return (
    <div className="App">
      <Router>
        <WebSocketProvider>
          <CallInvitationProvider>
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<MainPage />} />
              <Route path="/myprofile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/messages" element={<ChatPage />} />
              <Route path="/videocall" element={<VideoCall />} />
            </Routes>
          </CallInvitationProvider>
        </WebSocketProvider>
      </Router>

      
    </div>
  );
}

export default App;
