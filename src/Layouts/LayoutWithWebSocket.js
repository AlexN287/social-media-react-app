import React from 'react';
import { WebSocketProvider } from '../Context/WebSocketContext';

const LayoutWithWebSocket = ({ children }) => {
    return (
        <div>
            <WebSocketProvider>
            {children}
        </WebSocketProvider>
        </div>
    );
};

export default LayoutWithWebSocket;
