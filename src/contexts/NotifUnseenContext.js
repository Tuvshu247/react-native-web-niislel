import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";

const NotifUnseenContext = createContext({
    unseenCount: 0,
    refresh: () => { },
});

export const NotifUnseenProvider = ({ children }) => {
    const { data, request, loading, error } = useApi();
    const [unseenCount, setUnseenCount] = useState(0);

    const refresh = useCallback(async () => {
        const response = await request("notif_unseen_count/");
        if (response?.unseen_count !== undefined) {
            setUnseenCount(response.unseen_count);
        }
    }, [request]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (data?.unseen_count !== undefined) {
            setUnseenCount(data.unseen_count);
        }
    }, [data]);

    return (
        <NotifUnseenContext.Provider value={{ unseenCount, refresh, loading, error }}>
            {children}
        </NotifUnseenContext.Provider>
    );
};

export const useNotifUnseen = () => useContext(NotifUnseenContext);
