import { BASE_URL } from "../constants/urls";
import { safeSetItem } from "../functions";
import api from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { closeWebSocket } from "@/lib/websocket";
import { useUnread } from "@/contexts/UnreadContext";

export function useAuth() {
    const { resetUnread, startUnread } = useUnread()
    const { setUserRole } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const processAuth = async (tokenData) => {
        const { access, refresh, username } = tokenData;

        if (username) await safeSetItem("username", username);
        await safeSetItem("access_token", access);
        await safeSetItem("refresh_token", refresh);

        const decoded = jwtDecode(access);
        if (decoded.user_id) await safeSetItem("user_id", decoded.user_id.toString());

        const { data: userInfo } = await api.get("user_info/");
        const { id, last_name, first_name, positions, user_role, profile } = userInfo;

        await Promise.all([
            safeSetItem("member_id", id),
            safeSetItem("last_name", last_name),
            safeSetItem("first_name", first_name),
            safeSetItem("position", positions[0]?.position_name || ""),
            safeSetItem("user_role", user_role.toString()),
            safeSetItem("profile", profile),
        ]);
        setUserRole(user_role.toString());
        resetUnread()
        startUnread()
        return "success";
    };

    const authenticate = async (endpoint, payload) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post(`${BASE_URL}${endpoint}`, payload);
            return await processAuth(data);
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(
                detail === "No active account found with the given credentials"
                    ? "Нэвтрэх нэр эсвэл нууц үг буруу байна"
                    : detail || "Нэвтрэхэд алдаа гарлаа"
            );
            return "failed";
        } finally {
            setLoading(false);
        }
    };

    const danLogin = (code) => authenticate("token/dan/", { code });
    const login = (username, password) =>
        authenticate("token/", { username, password });
    const logout = async () => {
        try {
            await AsyncStorage.clear();
            closeWebSocket();
            setUserRole(null);
            resetUnread();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    return {
        danLogin,
        login,
        logout,
        loading,
        error,
    };
}
