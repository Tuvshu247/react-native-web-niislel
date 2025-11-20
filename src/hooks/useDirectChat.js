import { useChatApi } from "@/hooks/useChatApi";
import { useWebSocket } from "@/contexts/WebSocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useDirectChat = (chatId, member) => {
    const { send, subscribe } = useWebSocket();
    const { data, request } = useChatApi();

    const parsedMember = member ? JSON.parse(member) : null;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userId, setUserId] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const id = await AsyncStorage.getItem("user_id");
            const member_id = await AsyncStorage.getItem("member_id");
            const email = await AsyncStorage.getItem("username");
            setUserId(id);
            setMemberId(member_id);
            setUserEmail(email);
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (chatId && userId) {
            request(`/direct-chat-messages?chat_id=${chatId}`);
        }
    }, [chatId, request, userId]);

    useEffect(() => {
        if (!data || !userId) return;
        const mapped = data.map((msg) => {
            const sender =
                String(msg.SenderUserID) === String(userId).trim()
                    ? "me"
                    : "other";
            return {
                id: msg.ID.toString(),
                text: msg.Content,
                sender,
                created_at: msg.CreatedAt,
            };
        });
        setMessages(mapped);
    }, [data, userId]);

    useEffect(() => {
        const unsubscribe = subscribe((msg) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: msg.content || "",
                    sender: msg.sender === userId ? "me" : "other",
                },
            ]);
        });
        return () => unsubscribe();
    }, [subscribe, userId]);

    const handleSend = () => {
        if (!input.trim() || !userId) return;
        const payload = {
            type: "direct",
            target: String(parsedMember?.user_id),
            sender: String(userId),
            content: input,
            member_id: memberId,
            email: userEmail,
            target_member_id: String(parsedMember?.id),
            target_email: parsedMember?.email,
        };
        send(payload);
        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), text: input, sender: "me" },
        ]);
        setInput("");
    };

    return {
        parsedMember,
        messages,
        input,
        setInput,
        handleSend,
    };
};
