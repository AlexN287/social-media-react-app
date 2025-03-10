import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// Context to store WebSocket connection
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const token = localStorage.getItem('token');
    const location = useLocation();

    useEffect(() => {
        // Check if the current path is not /signin or /signup
        if (location.pathname === '/' || location.pathname === '/signup') return;

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({'Authorization': `Bearer ${token}`}, frame => {
            console.log('Connected: ' + frame);
            setClient(stompClient);
        }, error => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, [location.pathname, token]);

    const sendMessage = (destination, message) => {
        if (client && client.connected) {
            client.send(destination, {}, JSON.stringify(message));
        }
    };

    const contextValue = {
        client,
        sendMessage
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};