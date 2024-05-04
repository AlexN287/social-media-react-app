import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // const [token, setToken] = useState(localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const loggedUser = await getLoggedUser(token);
                    setUser(loggedUser);
                } catch (error) {
                    console.error('Error validating token:', error);
                    logout();  // This will clear user and token if the token is invalid
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        
        validateToken();
    }, [token]);

    const getLoggedUser = async (token) => {
        try {
            const response = await axios.get('http://localhost:8080/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        //setToken(null);
        setUser(null);
    };

    // const updateToken = (newToken) => {
    //     localStorage.setItem('token', newToken);
    //     setToken(newToken);
    // };

    return (
        <AuthContext.Provider value={{ user, setUser, token, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext); 
}
