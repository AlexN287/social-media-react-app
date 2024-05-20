import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import React, { useEffect, useContext, createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { getLoggedUser } from "../Services/User/UserService";
import { getConversationMembers } from "../Services/Conversation/ConversationService";
import { fetchUserProfileImage } from "../Services/User/UserService";

const CallInvitationContext = createContext(null);

const CallInvitationProvider = ({ children }) => {
    const location = useLocation();
    const [zp, setZp] = useState(null);
  
    useEffect(() => {
      const initializeCallInvitation = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        // Check if the current path is not /signin or /signup
        if (location.pathname === '/' || location.pathname === '/signup') return;
  
        try {
          const user = await getLoggedUser(token);
          const appID = ;
          const serverSecret = "";
          const userID = user.id + "";
          const userName = user.username;
          const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, null, userID, userName);
  
          console.log("UserId: " + userID);
          console.log("Username: " + userName);
  
          const zpInstance = ZegoUIKitPrebuilt.create(TOKEN);
          zpInstance.addPlugins({ ZIM });
  
          zpInstance.setCallInvitationConfig({
            onSetRoomConfigBeforeJoining: (callType) => {

              return {
                turnOnMicrophoneWhenJoining: false,
                turnOnCameraWhenJoining: false,
                showMyCameraToggleButton: true,
                showMyMicrophoneToggleButton: true,
                showAudioVideoSettingsButton: true,
                showScreenSharingButton: true,
                showTextChat: true,
                showUserList: true,
                maxUsers: 2, //DON T FORGET TO CHANGE THIS, REALLY DON T FORGET TO CHANGE THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
                layout: "Auto",
                showLayoutButton: false,

                onUserAvatarSetter: async (userList) => {
                  await Promise.all(userList.map(async (user) => {
                    const avatar = await fetchUserProfileImage(parseInt(user.userID, 10), token);
                    console.log(avatar);
                    console.log(user.userID);
                    user.setUserAvatar(avatar);
                  }));
                },
              };
            },
           
          });
  
          setZp(zpInstance);
  
        } catch (error) {
          console.error('Error initializing call invitation:', error);
        }
      };
  
      initializeCallInvitation();
    }, [location.pathname]);
  
    return (
      <CallInvitationContext.Provider value={zp}>
        {children}
      </CallInvitationContext.Provider>
    );
  };
  
  export default CallInvitationProvider;
  
  export const useCallInvitation = () => {
    return useContext(CallInvitationContext);
  };