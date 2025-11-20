import { CHAT_WS_URL } from "@/constants/urls";
import { getUserInfo } from "@/functions";

let socket = null;
let userInfo = null;
let messageCallbacks = [];
let reconnectTimeout = null;
let retryCount = 0;
const MAX_RETRIES = 10;
let isManuallyClosed = false;
let isConnecting = false;
let sendQueue = [];

const getWsUrl = () => {
    if (!userInfo) return null;
    return `${CHAT_WS_URL}?userid=${userInfo.userId}`;
};

const handleOpen = () => {
    console.log("[WebSocket] Connected");
    retryCount = 0;
    isConnecting = false;

    sendQueue.forEach((msg) => socket.send(JSON.stringify(msg)));
    sendQueue = [];
};

const handleClose = () => {
    console.warn("[WebSocket] Disconnected");
    socket = null;
    if (!isManuallyClosed) attemptReconnect();
};

const handleError = (err) => {
    console.error("[WebSocket] Error", err);
};

const handleMessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        messageCallbacks.forEach((cb) => cb(data));
    } catch (err) {
        console.error("[WebSocket] Parse error", err);
    }
};

const attemptReconnect = () => {
    if (retryCount >= MAX_RETRIES || isConnecting) return;

    isConnecting = true;
    const delay = Math.min(5000, 1000 * 2 ** retryCount);
    console.log(`[WebSocket] Reconnecting in ${delay}ms...`);
    retryCount++;

    reconnectTimeout = setTimeout(() => {
        isConnecting = false;
        connectWebSocket();
    }, delay);
};

export const connectWebSocket = async () => {
    if (socket && socket.readyState === WebSocket.OPEN) return;
    if (isConnecting) return;

    isConnecting = true;
    isManuallyClosed = false;

    if (!userInfo) {
        try {
            userInfo = await getUserInfo();
        } catch (err) {
            console.error("[WebSocket] Failed to fetch user info", err);
            isConnecting = false;
            return;
        }
    }

    const url = getWsUrl();
    if (!url) {
        isConnecting = false;
        return;
    }

    socket = new WebSocket(url);
    socket.onopen = handleOpen;
    socket.onclose = handleClose;
    socket.onerror = handleError;
    socket.onmessage = handleMessage;
};

export const sendMessage = (message) => {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        sendQueue.push(message);
        connectWebSocket();
    }
};

export const subscribeToMessages = (callback) => {
    messageCallbacks.push(callback);
    return () => {
        messageCallbacks = messageCallbacks.filter((cb) => cb !== callback);
    };
};

export const closeWebSocket = () => {
    isManuallyClosed = true;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    socket?.close();
    socket = null;
    userInfo = null;
    messageCallbacks = [];
    retryCount = 0;
    isConnecting = false;
    sendQueue = [];
};
