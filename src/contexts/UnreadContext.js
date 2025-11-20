import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useWebSocket } from "./WebSocketContext";
import { getUserInfo } from "@/functions";
import { useChatApi } from "@/hooks/useChatApi";

const UnreadContext = createContext({
    unreadCount: 0,
    setUnreadCount: () => { },
});

export const UnreadProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [chatServiceUserId, setChatServiceUserId] = useState(null);

    const { subscribe } = useWebSocket();
    const { request: chatRequest, data: chats } = useChatApi();
    const { request: chatServiceRequest, data: chatServiceData } = useChatApi();

    const startUnread = useCallback(async () => {
        const userInfo = await getUserInfo();
        if (userInfo?.userId) {
            setUserId(userInfo.userId);
        }
    }, []);

    const resetUnread = useCallback(() => {
        setUnreadCount(0);
        setUserId(null);
        setChatServiceUserId(null);
    }, []);

    const refreshUnread = useCallback(async () => {
        if (!userId) return;

        try {
            await chatServiceRequest(`/chat-service-user_id?user_id=${userId}`);
            if (chatServiceUserId) {
                await chatRequest(`/chats?user_id=${chatServiceUserId}`);
            }
        } catch (error) {
            console.error('Error refreshing unread count:', error);
        }
    }, [userId, chatServiceUserId, chatRequest, chatServiceRequest]);


    const contextValue = useMemo(() => ({
        unreadCount,
        setUnreadCount,
        resetUnread,
        startUnread,
        refreshUnread
    }), [unreadCount, resetUnread, startUnread, refreshUnread]);

    useEffect(() => {
        const initializeUser = async () => {
            const userInfo = await getUserInfo();
            if (userInfo?.userId) {
                setUserId(userInfo.userId);
            }
        };

        initializeUser();
    }, []);

    useEffect(() => {
        if (!userId) return;
        chatServiceRequest(`/chat-service-user_id?user_id=${userId}`);
    }, [userId, chatServiceRequest]);

    useEffect(() => {
        if (chatServiceData && chatServiceData !== chatServiceUserId) {
            setChatServiceUserId(chatServiceData);
        }
    }, [chatServiceData, chatServiceUserId]);

    useEffect(() => {
        if (!chatServiceUserId) return;
        chatRequest(`/chats?user_id=${chatServiceUserId}`);
    }, [chatServiceUserId, chatRequest]);

    useEffect(() => {
        if (!chats || !Array.isArray(chats) || !chatServiceUserId) {
            return;
        }

        const countUnread = chats.reduce((count, chat) => {
            const isUnread = chat.LastMessageStatus !== "seen" &&
                chat.LastMessageSenderID !== chatServiceUserId;

            return isUnread ? count + 1 : count;
        }, 0);

        setUnreadCount(countUnread);
    }, [chats, chatServiceUserId]);

    useEffect(() => {
        if (!subscribe || !chatServiceUserId) {
            return;
        }

        const handleWebSocketUpdate = (data) => {
            chatRequest(`/chats?user_id=${chatServiceUserId}`);
        };

        const unsubscribe = subscribe(handleWebSocketUpdate);

        return () => {
            unsubscribe?.();
        };
    }, [subscribe, chatServiceUserId, chatRequest]);

    return (
        <UnreadContext.Provider value={contextValue}>
            {children}
        </UnreadContext.Provider>
    );
};

export const useUnread = () => {
    const context = useContext(UnreadContext);
    if (!context) {
        throw new Error('useUnread must be used within an UnreadProvider');
    }
    return context;
};
