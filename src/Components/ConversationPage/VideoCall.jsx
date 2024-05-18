import React, {useEffect, useState} from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { getLoggedUser } from '../../Services/User/UserService';
import { fetchUserProfileImage } from '../../Services/User/UserService';


function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
      const [user, setUser] = useState(null);
      const [profileImage, setProfileImage] = useState(null);
      const token = localStorage.getItem('token');
      const roomID = getUrlParams().get('roomID') || randomID(5);

      useEffect(() => {
        getLoggedUser(token).then(userData => {
          setUser(userData);
          fetchUserProfileImage(userData.id, token).then(imageUrl => {
            setProfileImage(imageUrl);
          }).catch(error => {
            console.error('Error fetching profile image:', error);
          });
        }).catch(error => {
          console.error('Error fetching logged user:', error);
        });
      }, [token]);

      let myMeeting = async (element) => {
     // generate Kit Token
      const appID = ;
      const serverSecret = "";
      const userID = user.id;
      const userName = user.userName;
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  userID,  userName);

      


     // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // start the call
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
             window.location.protocol + '//' + 
             window.location.host + window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        showPreJoinView: false,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        onUserAvatarSetter: (userList) => {
          userList.forEach(user => {
            if (user.userID === userID) {
              user.setUserAvatar(profileImage);
            }
          });
        },
        turnOnMicrophoneWhenJoining: false,
           	turnOnCameraWhenJoining: false,
           	showMyCameraToggleButton: true,
           	showMyMicrophoneToggleButton: true,
           	showAudioVideoSettingsButton: true,
           	showScreenSharingButton: true,
           	showTextChat: true,
           	showUserList: true,
           	maxUsers: 2,
           	layout: "Auto",
           	showLayoutButton: false,
      });


  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}