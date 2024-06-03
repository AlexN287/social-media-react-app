import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from '../../Hooks/Common/UseOutsideClick';
import '../../Styles/Components/MainPage/SearchBar.css';
import { useUserNavigation } from '../../Routes/NavigationUtils';
import UserProfileImage from '../Common/ProfileImage';

const SearchBar = ({ searchFunction, onSearchResults = null, showResultsContainer = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isSearchCompleted, setIsSearchCompleted] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const { handleUserClick } = useUserNavigation();

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useOutsideClick(ref, () => {
    if (searchResults.length > 0) {
      setSearchResults([]); // Close the search results
    }
  });

  useEffect(() => {
    const performSearch = async () => {
      const token = getToken();
      if (token && !isSearchCompleted) {
        try {
          const results = await searchFunction(searchTerm, token);
          setSearchResults(results);
          if (onSearchResults) {
            onSearchResults(results);
          }
          setIsSearchCompleted(true);
        } catch (error) {
          console.error('Error fetching search results', error);
          setError(error.message);
          setSearchResults([]);
          if (onSearchResults) {
            onSearchResults([]);
          }
        }
      } else {
        setSearchResults([]);
        if (onSearchResults) {
          onSearchResults([]);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (searchTerm && !isSearchCompleted) performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isSearchCompleted, onSearchResults, searchFunction]);

  const handleButtonClick = async (event) => {
    event.preventDefault();
    const token = getToken();
    if (token) {
      try {
        const results = await searchFunction(searchTerm, token);
        setSearchResults(results);
        if (onSearchResults) {
          onSearchResults(results);
        }
        setIsSearchCompleted(true);
      } catch (error) {
        console.error('Error fetching search results', error);
        setError(error.message);
        setSearchResults([]);
        if (onSearchResults) {
          onSearchResults([]);
        }
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearchCompleted(false); // Reset the flag to allow searching again
  };

  return (
    <div className="search-container" ref={ref}>
      <form onSubmit={handleButtonClick} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {showResultsContainer && searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((user) => (
            <li key={user.id} className="search-result-item" onClick={() => handleUserClick(user.id)}>
              <UserProfileImage userId={user.id} token={getToken()} size={'small'} />
              <span className="search-bar-username">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
