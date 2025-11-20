import { CHAT_API_URL } from "@/constants/urls";
import { refreshToken } from "@/lib/refreshToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const chatApi = axios.create({
    baseURL: CHAT_API_URL,
});

chatApi.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

chatApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshToken();

            if (newAccessToken) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return chatApi(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default chatApi;
