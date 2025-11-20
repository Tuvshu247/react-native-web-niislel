import AsyncStorage from "@react-native-async-storage/async-storage";
import { shortWeekdayMap } from "@/lib/utils";
import dayjs from "dayjs";

export const safeSetItem = async (key, value) => {
    if (value !== null && value !== undefined) {
        await AsyncStorage.setItem(key, String(value));
    }
};

export const getUserInfo = async () => {
    try {
        const [
            memberId,
            username,
            userId,
            lastName,
            firstName,
            position,
            userRole,
            profile,
        ] = await Promise.all([
            AsyncStorage.getItem("member_id"),
            AsyncStorage.getItem("username"),
            AsyncStorage.getItem("user_id"),
            AsyncStorage.getItem("last_name"),
            AsyncStorage.getItem("first_name"),
            AsyncStorage.getItem("position"),
            AsyncStorage.getItem("user_role"),
            AsyncStorage.getItem("profile"),
        ]);

        return {
            memberId,
            username,
            userId,
            lastName,
            firstName,
            position,
            userRole,
            profile,
        };
    } catch (error) {
        console.error("Failed to get user info from AsyncStorage", error);
        return null;
    }
};

export const getNextDays = (count = 14, offset = -1) => {
    const days = [];
    for (let i = offset; i < count + offset; i++) {
        const date = dayjs().add(i, "day");
        days.push({
            label: shortWeekdayMap[date.format("dddd")],
            date: date.format("YYYY-MM-DD"),
            day: date.format("D"),
        });
    }
    return days;
};

export function formatDate(created_at) {
    const now = dayjs();
    const created = dayjs(created_at);

    const diffMinutes = now.diff(created, "minute");
    const diffHours = now.diff(created, "hour");
    const diffDays = now.diff(created, "day");

    if (diffMinutes < 1) return "Дөнгөж саяхан";
    if (diffMinutes < 60) return `${diffMinutes} минутын өмнө`;
    if (diffHours < 24) return `${diffHours} цагийн өмнө`;
    if (diffDays < 7) return `${diffDays} өдрийн өмнө`;

    return created.format("YYYY-MM-DD");
}

export const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("mn-MN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatNativeDate = (date) =>
    new Date(date).toISOString().split("T")[0];
