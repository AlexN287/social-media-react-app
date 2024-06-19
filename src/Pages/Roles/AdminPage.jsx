import '../../Styles/Pages/Roles/AdminPage.css';

import React, { useState, useEffect } from 'react';
import Menu from '../../Components/MainPage/Menu';
import { getAllUsersWithRoles, modifyUserRoles } from '../../Services/Roles/AdminService';
import AdminSearchBar from '../../Components/AdminPage/AdminSearchBar';
import UserItem from '../../Components/AdminPage/UserItem';
import PaginationControls from '../../Components/Common/PaginationControls';
import SearchBar from '../../Components/MainPage/SearchBar';
import { searchUsersAsAdmin } from '../../Services/Search/SearchService';


const AdminPage = () => {
    const [usersWithRoles, setUsersWithRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState({});
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUsersWithRoles = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await getAllUsersWithRoles(token, page, size);
                    setUsersWithRoles(response.content);
                    setTotalPages(response.totalPages);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            } else {
                setError('No token found');
                setLoading(false);
            }
        };

        fetchUsersWithRoles();
    }, [page, size]);

    const handleRoleChange = (userId, selectedRoles) => {
        if (!selectedRoles.includes('USER')) {
            selectedRoles.push('USER');
        }
        // Ensure at least one role is selected
        if (selectedRoles.length === 0) {
            return;
        }

        setUsersWithRoles(usersWithRoles.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    roles: selectedRoles
                };
            }
            return user;
        }));
    };

    const handleSubmit = async (userId, roles) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const message = await modifyUserRoles(userId, roles, token);
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [userId]: { type: 'success', text: message }
                }));
            } catch (error) {
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [userId]: { type: 'error', text: error.message }
                }));
            }
        } else {
            setMessages(prevMessages => ({
                ...prevMessages,
                [userId]: { type: 'error', text: 'No token found' }
            }));
        }
    };

    const handleBannerClose = (userId) => {
        setMessages(prevMessages => {
          const newMessages = { ...prevMessages };
          delete newMessages[userId];
          return newMessages;
        });
      };
    
    const handleSearchResults = (results) => {
        //setSearchResults(results);
        setUsersWithRoles(results);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='admin-page-container'>
            <Menu />
            <div className='admin-content'>
                <div className='admin-search-bar'>
                    <SearchBar searchFunction={searchUsersAsAdmin}
                        onSearchResults={handleSearchResults}
                        showResultsContainer={false}/>
                </div>
                {usersWithRoles.map(user => (
                    <UserItem
                    key={user.id}
                    user={user}
                    handleRoleChange={handleRoleChange}
                    handleSubmit={handleSubmit}
                    message={messages[user.id]}
                    handleBannerClose={handleBannerClose}
                  />
                ))}
                <PaginationControls
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />

            </div>


        </div>
    );
};

export default AdminPage;