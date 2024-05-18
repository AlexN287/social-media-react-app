// import logo from './logo.svg';
import './App.css';
// import React, { useState } from 'react';
import React from 'react';
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


function App() {
  // const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={
            <WebSocketProvider>
              <MainPage />
            </WebSocketProvider>
          } />
          <Route path="/myprofile" element={
            <WebSocketProvider>
              <ProfilePage />
            </WebSocketProvider>
          } />
          <Route path="/profile/:userId" element={
            <WebSocketProvider>
              <UserProfile />
            </WebSocketProvider>
          } />
          <Route path="/messages" element={
            <WebSocketProvider>
              <ChatPage />
            </WebSocketProvider>
          } />

<Route path="/videocall" element={
            
              <VideoCall />
            
          } />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
