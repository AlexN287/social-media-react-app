import '../../Styles/Pages/Roles/AdminPage.css';

import React, { useState, useEffect } from 'react';
import Menu from '../../Components/MainPage/Menu';
import { getAllUsersWithRoles, modifyUserRoles } from '../../Services/Roles/AdminService'; // Adjust the path as needed
import Button from '../../Components/Common/Button';
import UserProfileImage from '../../Components/Common/ProfileImage';
import MessageBanner from '../../Components/Common/MessageBanner';
import AdminSearchBar from '../../Components/AdminPage/AdminSearchBar';

const ROLES = ['USER', 'MODERATOR', 'ADMIN'];

const AdminPage = () => {
    const [usersWithRoles, setUsersWithRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchUsersWithRoles = async () => {
            const token = localStorage.getItem('token'); // Assuming token is stored in local storage
            if (token) {
                try {
                    const users = await getAllUsersWithRoles(token);
                    setUsersWithRoles(users);
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
    }, []);

    const handleRoleChange = (userId, selectedRoles) => {
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
                setSuccessMessage(message);
                setError(null);
            } catch (error) {
                setError(error.message);
                setSuccessMessage(null);
            }
        } else {
            setError('No token found');
            setSuccessMessage(null);
        }
    };

    const handleBannerClose = () => {
        setSuccessMessage(null);
        setError(null);
    };

    const handleSearchResults = (results) => {
        //setSearchResults(results);
        setUsersWithRoles(results);
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
                    <AdminSearchBar onSearchResults={handleSearchResults}/>
                </div>
                {successMessage && <div>{successMessage}</div>}
                {usersWithRoles.map(user => (
                    <div key={user.id} className="user-row">
                        <div className='change-roles-container'>
                            <div className='admin-page-user-info'>
                                <UserProfileImage userId={user.id} token={localStorage.getItem('token')} size={'medium'} />
                                <div className="current-roles">
                                    <h3>{user.username}</h3>
                                    <strong>Current Roles:</strong> {user.roles.join(', ')}
                                </div>
                            </div>

                            <div className="roles-select">
                                <label>
                                    Select New Roles:
                                    <select
                                        multiple
                                        value={user.roles}
                                        onChange={(e) => handleRoleChange(user.id, Array.from(e.target.selectedOptions, option => option.value))}
                                    >
                                        {ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                        </div>

                        <div className="button-container">
                            <Button color={'green'} onClick={() => handleSubmit(user.id, user.roles)}>Submit</Button>
                        </div>
                    </div>
                ))}
                {successMessage && <MessageBanner message={successMessage} type="success" onClose={handleBannerClose} />}
                {error && <MessageBanner message={error} type="error" onClose={handleBannerClose} />}
            </div>

        </div>
    );
};

export default AdminPage;