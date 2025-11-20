import { COLORS } from '@/constants/theme';
import { getNextDays } from '@/functions';
import { useApi } from '@/hooks/useApi';
import { isWeekend, weekdayMap } from '@/lib/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ScheduleScreen() {
    const [selectedDate, setSelectedDate] = useState(
        dayjs().format('YYYY-MM-DD'),
    );
    const [today, setToday] = useState(dayjs().locale('mn'));
    const [eventMap, setEventMap] = useState({});

    const { data, request, loading } = useApi();

    useEffect(() => {
        const interval = setInterval(() => {
            setToday(dayjs().locale('mn'));
        }, 500000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        request('calendar/');
    }, [request]);

    useEffect(() => {
        if (!data || !Array.isArray(data)) return;

        const cleanedData = data.filter(item => !('birth_date' in item));
        const grouped = {};

        cleanedData.forEach(item => {
            const start = dayjs(item.start_date, 'YYYY-MM-DD HH:mm');
            const dateKey = start.format('YYYY-MM-DD');

            if (!grouped[dateKey]) grouped[dateKey] = [];

            grouped[dateKey].push({
                title: (
                    item.title ||
                    item.meeting_value ||
                    'Тодорхойгүй'
                ).trim(),
                start: start.format('HH:mm'),
                end: item.end_date
                    ? dayjs(item.end_date, 'YYYY-MM-DD HH:mm').format('HH:mm')
                    : null,
                color: item.meeting_color || COLORS.primary,
            });
        });

        setEventMap(grouped);
    }, [data]);

    const days = getNextDays();
    const events = eventMap[selectedDate] || [];

    return (
        <View style={styles.container}>
            <Text style={styles.today}>
                {today.format('YYYY')} оны {today.format('M')} сарын{' '}
                {today.format('D')}{' '}
                <Text style={styles.todayWeekday}>
                    {weekdayMap[today.format('dddd')]}
                </Text>
            </Text>

            <Text style={styles.title}>ӨНӨӨДРИЙН ХУВААРЬ</Text>

            <FlatList
                data={days}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.date}
                contentContainerStyle={styles.dateList}
                renderItem={({ item }) => {
                    const isActive = selectedDate === item.date;
                    const isToday = item.date === today.format('YYYY-MM-DD');
                    const hasEvents =
                        eventMap[item.date] && eventMap[item.date].length > 0;

                    const dateItemStyle = [
                        styles.dateItem,
                        isActive && styles.activeDateItem,
                        isToday && styles.todayBorder,
                    ];

                    return (
                        <TouchableOpacity
                            onPress={() => setSelectedDate(item.date)}
                            style={dateItemStyle}
                        >
                            <Text
                                style={[
                                    styles.weekday,
                                    isWeekend(item.date) && styles.weekend,
                                    isActive && styles.activeText,
                                ]}
                            >
                                {item.label}
                            </Text>
                            <Text
                                style={[
                                    styles.day,
                                    isActive && styles.activeText,
                                ]}
                            >
                                {item.day}
                            </Text>
                            {hasEvents && (
                                <Star
                                    size={20}
                                    fill="#FFDB00"
                                    solid
                                    color={'#FFDB00'}
                                    style={styles.star}
                                />
                            )}
                        </TouchableOpacity>
                    );
                }}
            />

            <View style={styles.eventSection}>
                <View style={styles.eventTitleContainer}>
                    <Text style={styles.eventDot}>•</Text>
                    <Text style={styles.eventTitle}>ҮЙЛ АЖИЛЛАГАА</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                ) : events.length === 0 ? (
                    <Text style={styles.noEvents}>
                        Бүртгэлтэй үйл ажиллагаа байхгүй байна.
                    </Text>
                ) : (
                    events.map((event, index) => (
                        <View
                            key={index}
                            style={[
                                styles.eventCard,
                                { borderLeftColor: event.color },
                            ]}
                        >
                            <Text style={styles.eventName}>{event.title}</Text>
                            <Text style={styles.eventTime}>
                                {event.start} - {event.end || 'Тодорхойгүй'}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: isTablet ? 120 : 20,
    },
    title: {
        fontSize: isTablet ? 28 : 22,
        fontWeight: 'bold',
        marginBottom: isTablet ? 20 : 10,
    },
    today: {
        fontWeight: '400',
        fontSize: isTablet ? 20 : 15,
        color: '#888',
        marginBottom: isTablet ? 15 : 8,
    },
    todayWeekday: {
        color: COLORS.primary,
    },
    dateList: {
        paddingHorizontal: isTablet ? 20 : 10,
    },
    dateItem: {
        alignItems: 'center',
        padding: isTablet ? 20 : 13,
        marginHorizontal: isTablet ? 10 : 5,
        borderRadius: 10,
    },
    activeDateItem: {
        backgroundColor: COLORS.primary,
    },
    todayBorder: {
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    weekday: {
        color: '#888',
        fontSize: isTablet ? 16 : 12,
    },
    weekend: {
        color: 'red',
    },
    activeText: {
        color: '#fff',
    },
    day: {
        fontSize: isTablet ? 28 : 20,
        fontWeight: 'bold',
        color: '#000',
    },
    star: {
        marginTop: 6,
        transform: [{ scale: isTablet ? 1 : 1 }],
    },
    eventSection: {
        marginTop: isTablet ? 20 : 10,
    },
    eventTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: isTablet ? 15 : 10,
    },
    eventDot: {
        fontSize: isTablet ? 44 : 36,
        color: COLORS.primary,
        marginRight: 8,
    },
    eventTitle: {
        fontWeight: 'bold',
        fontSize: isTablet ? 20 : 16,
        color: '#000',
    },
    eventCard: {
        padding: isTablet ? 18 : 12,
        marginBottom: isTablet ? 14 : 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        borderLeftWidth: 4,
    },
    eventName: {
        fontWeight: 'bold',
        fontSize: isTablet ? 20 : 16,
    },
    eventTime: {
        fontSize: isTablet ? 16 : 14,
        color: '#666',
    },
    noEvents: {
        fontStyle: 'italic',
        color: '#999',
        fontSize: isTablet ? 16 : 14,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: isTablet ? 14 : 10,
        borderRadius: 10,
    },
});
