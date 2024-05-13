import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from '../../Hooks/Common/UseOutsideClick';
import '../../Styles/Components/MainPage/SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const ref = useRef(null);

  // Function to get token from local storage
  const getToken = () => {
    return localStorage.getItem('token'); // Replace 'token' with your token's key in local storage
  };

  useOutsideClick(ref, () => {
    if (searchResults.length > 0) {
      setSearchResults([]); // Close the search results
    }
  });

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
    <div className="dark-theme-page" ref={ref}>
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
