import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Components/MainPage/SearchBar.css';

// const imageCache = {};

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchProfileImage = async (userId) => {
//     if (imageCache[userId]) {
//       return imageCache[userId]; // Return cached image URL
//     }

//     try {
//       const response = await axios.get(`http://localhost:8080/${userId}/loadProfileImage`, {
//         responseType: 'arraybuffer',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
//       const imageUrl = URL.createObjectURL(imageBlob);
//       imageCache[userId] = imageUrl; // Cache the image URL
//       return imageUrl;
//     } catch (error) {
//       console.error('Error fetching profile image', error);
//       return 'default-profile-image.jpg'; // Return default image URL in case of error
//     }
//   };

//   const performSearch = async (cancelTokenSource) => {
//     if (!searchTerm.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:8080/search`, {
//         params: { username: searchTerm },
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         cancelToken: cancelTokenSource.token
//       });
//       setSearchResults(response.data);
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log('Request canceled:', error.message);
//       } else {
//         console.error('Error fetching search results', error);
//         setSearchResults([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const cancelTokenSource = axios.CancelToken.source();
//     const timeoutId = setTimeout(() => {
//       performSearch(cancelTokenSource);
//     }, 500);

//     return () => {
//       clearTimeout(timeoutId);
//       cancelTokenSource.cancel('Search was canceled due to new input');
//     };
//   }, [searchTerm]);

//   useEffect(() => {
//     const loadProfileImages = async () => {
//       const updatedResults = await Promise.all(searchResults.map(async (user) => {
//         const imageUrl = await fetchProfileImage(user.id);
//         return { ...user, profileImageUrl: imageUrl };
//       }));
//       setSearchResults(updatedResults);
//     };

//     if (searchResults.length > 0) {
//       loadProfileImages();
//     }
//   }, [searchResults]);

//   const handleButtonClick = async (event) => {
//     event.preventDefault();
//     await performSearch();
//   };

//   return (
//     <div className="dark-theme-page">
//       <div className="search-container">
//         <form onSubmit={handleButtonClick} className="search-form">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button type="submit" className="search-button">Search</button>
//         </form>
//         {searchResults.length > 0 && (
//           <ul className="search-results">
//             {searchResults.map((user) => (
//               <li key={user.id} className="search-result-item">
//                 <img 
//                   src={user.profileImageUrl || 'default-profile-image.jpg'} 
//                   alt={`${user.username}'s profile`} 
//                   loading="lazy" 
//                 />
//                 {user.username}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchBar;



const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Function to get token from local storage
  const getToken = () => {
    return localStorage.getItem('token'); // Replace 'token' with your token's key in local storage
  };

  // Debounce search triggered by typing
  useEffect(() => {
    const performSearch = async () => {
      const token = getToken();
      if (searchTerm && token) {
        try {
          const response = await axios.get(`http://localhost:8080/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { username: searchTerm }
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      if (searchTerm) performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Explicit search triggered by button click
  const handleButtonClick = async (event) => {
    event.preventDefault();
    const token = getToken();
    if (searchTerm.trim() && token) {
      try {
        const response = await axios.get(`http://localhost:8080/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { username: searchTerm }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results', error);
        setSearchResults([]);
      }
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); // Redirect to the user's profile page
  };

  return (
    <div className="dark-theme-page">
      <div className="search-container">
        <form onSubmit={handleButtonClick} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((user) => (
              <li key={user.id} className="search-result-item" onClick={() => handleUserClick(user.id)}>
              {user.username}
            </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
