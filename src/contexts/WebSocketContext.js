import React, { createContext, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    connectWebSocket,
    closeWebSocket,
    sendMessage,
    subscribeToMessages,
} from '@/lib/websocket';

const WebSocketContext = createContext({
    send: () => { },
    subscribe: () => () => { },
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const lastToken = useRef(null);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('access_token');
            if (token) {
                lastToken.current = token;
                await connectWebSocket();
            }
        })();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentToken = await AsyncStorage.getItem('access_token');

            if (currentToken && currentToken !== lastToken.current) {
                console.log('[WebSocket] Token changed');
                lastToken.current = currentToken;

                closeWebSocket();
                await connectWebSocket();
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        return () => closeWebSocket();
    }, []);

    return (
        <WebSocketContext.Provider
            value={{
                send: sendMessage,
                subscribe: subscribeToMessages,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};
