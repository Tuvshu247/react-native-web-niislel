import dayjs from "dayjs";

export const ATTENDANCE_LABELS = {
    Ирсэн: "Ирсэн",
    Ирээгүй: "Ирээгүй",
    Чөлөөтэй: "Чөлөөтэй",
    "Эмнэлгийн чөлөө": "Эмнэлгийн чөлөө",
    "Олон улсын томилолт": "Олон улсын томилолт",
    "Орон нутгийн томилолт": "Орон нутгийн томилолт",
    "Холбоо барих боломжгүй": "Холбоо барих боломжгүй",
};

export const ATTENDANCE_COLORS = {
    Ирсэн: "#4CAF50",
    Ирээгүй: "#F44336",
    Чөлөөтэй: "#FF9800",
    "Эмнэлгийн чөлөө": "#9C27B0",
    "Олон улсын томилолт": "#2196F3",
    "Орон нутгийн томилолт": "#00BCD4",
    "Холбоо барих боломжгүй": "#9E9E9E",
};

export const weekdayMap = {
    Monday: "Даваа",
    Tuesday: "Мягмар",
    Wednesday: "Лхагва",
    Thursday: "Пүрэв",
    Friday: "Баасан",
    Saturday: "Бямба",
    Sunday: "Ням",
};

export const shortWeekdayMap = {
    Monday: "Да",
    Tuesday: "Мя",
    Wednesday: "Лх",
    Thursday: "Пү",
    Friday: "Ба",
    Saturday: "Бя",
    Sunday: "Ня",
};

export const isWeekend = (dateStr) => {
    const weekday = dayjs(dateStr).format("dddd");
    return weekday === "Saturday" || weekday === "Sunday";
};

export const leaveTypes = [
    { id: 1, label: "Чөлөөтэй" },
    { id: 2, label: "Эмнэлгийн чөлөө" },
    { id: 3, label: "Олон улсын томилолт" },
    { id: 4, label: "Орон нутгийн томилолт" },
];

export const PHONE_LIST_TABS = [
    { label: "Ажлын алба", value: "staff" },
    { label: "НИТХ-н төлөөлөгч", value: "member" },
];

export function timeAgoMongolian(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    let diff = now.getTime() - past.getTime();

    if (diff < 0) diff = 0;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `1 сек`;
    if (minutes < 60) return `${minutes} мин`;
    if (hours < 24) return `${hours} цаг`;
    if (days < 30) return `${days} өдөр`;
    if (months < 12) return `${months} сар`;
    return `${years} жил`;
}
