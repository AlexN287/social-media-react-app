import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Components/MainPage/SearchBar.css'; 

import { searchUsersAsAdmin } from '../../Services/Search/SearchService';

const AdminSearchBar = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [isSearchCompleted, setIsSearchCompleted] = useState(false); // Flag to track if search is completed
    const navigate = useNavigate();
    const ref = useRef(null);

    const getToken = () => {
        return localStorage.getItem('token');
    };

    useEffect(() => {
        const performSearch = async () => {
            const token = getToken();
            if (token && !isSearchCompleted) {
                try {
                    const results = await searchUsersAsAdmin(searchTerm, token);
                    setSearchResults(results);
                    onSearchResults(results); // Call the onSearchResults function to handle the search results
                    setIsSearchCompleted(true); // Mark the search as completed
                } catch (error) {
                    console.error('Error fetching search results', error);
                    setError(error.message);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchTerm && !isSearchCompleted) performSearch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, isSearchCompleted, onSearchResults]);

    const handleButtonClick = async (event) => {
        event.preventDefault();
        const token = getToken();
        if (token) {
            try {
                const results = await searchUsersAsAdmin(searchTerm, token);
                setSearchResults(results);
                onSearchResults(results);
                setIsSearchCompleted(true); // Mark the search as completed
            } catch (error) {
                console.error('Error fetching search results', error);
                setError(error.message);
                setSearchResults([]);
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
        </div>
    );
};

export default AdminSearchBar;