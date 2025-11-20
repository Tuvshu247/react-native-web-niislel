import NoData from '@/components/ui/NoData';
import { IMAGE_URL } from '@/constants/urls';
import { ATTENDANCE_COLORS, ATTENDANCE_LABELS } from '@/lib/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/mn';
import { useState, useMemo, useCallback } from 'react';
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Modal,
    Platform,
} from 'react-native';
import { shadow, COLORS } from '@/constants/theme';

export default function MeetingReport({ data = [] }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);

    const sortedData = useMemo(
        () =>
            data?.sort(
                (a, b) =>
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime(),
            ),
        [data],
    );

    const filteredData = useMemo(() => {
        if (!selectedDate) return sortedData;

        return sortedData.filter(item =>
            dayjs(item.start_date).isSame(dayjs(selectedDate), 'day'),
        );
    }, [sortedData, selectedDate]);

    const handleDateChange = useCallback((event, date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (date) setSelectedDate(date);
    }, []);

    const clearDate = useCallback(() => {
        setSelectedDate(null);
    }, []);

    const showDatePicker = useCallback(() => {
        setShowPicker(true);
    }, []);

    const hideDatePicker = useCallback(() => {
        setShowPicker(false);
    }, []);

    const renderItem = useCallback(
        ({ item }) => (
            <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>
                    {dayjs(item.start_date).format('YYYY.MM.DD HH:mm')}
                </Text>

                <View style={styles.scopeRow}>
                    <Image
                        source={{
                            uri: `${IMAGE_URL}${item.meeting_type.image_url}`,
                        }}
                        style={styles.scopeImage}
                    />
                    <Text style={styles.scopeText}>
                        {item.meeting_type.name}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.attendanceContainer}>
                    {Object.keys(ATTENDANCE_LABELS).map(key => {
                        const value = item.attendance_percentages?.[key] ?? 0;
                        return (
                            <View key={key} style={styles.attendanceRow}>
                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor:
                                                ATTENDANCE_COLORS[key] ??
                                                '#000',
                                        },
                                    ]}
                                />
                                <Text style={styles.attendanceText}>
                                    {ATTENDANCE_LABELS[key]}:{' '}
                                    {parseFloat(value).toFixed(2)} %
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        ),
        [],
    );

    const keyExtractor = useCallback(item => item.id.toString(), []);

    const ListEmptyComponent = useCallback(() => <NoData />, []);

    return (
        <View style={styles.wrapper}>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={showDatePicker}
                    activeOpacity={0.8}
                >
                    <Text style={styles.dateButtonText}>
                        {selectedDate
                            ? dayjs(selectedDate).format('M-р сарын D-н')
                            : '🗓 Огноогоор шүүх'}
                    </Text>
                </TouchableOpacity>

                {selectedDate && (
                    <TouchableOpacity
                        style={styles.clearDateButton}
                        onPress={clearDate}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.clearDateText}>Огноо цэвэрлэх</Text>
                    </TouchableOpacity>
                )}
            </View>

            {showPicker && (
                <Modal
                    visible={showPicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={hideDatePicker}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity
                            style={styles.modalBackground}
                            activeOpacity={1}
                            onPress={hideDatePicker}
                        />
                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity onPress={hideDatePicker}>
                                    <Text style={styles.cancelButton}>
                                        Болих
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.pickerTitle}>
                                    Огноо сонгох
                                </Text>
                                <TouchableOpacity onPress={hideDatePicker}>
                                    <Text style={styles.doneButton}>
                                        Болсон
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={selectedDate || new Date()}
                                mode="date"
                                display={
                                    Platform.OS === 'ios'
                                        ? 'spinner'
                                        : 'default'
                                }
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                                style={styles.datePicker}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            <FlatList
                data={filteredData}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
                ListEmptyComponent={ListEmptyComponent}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                windowSize={10}
                initialNumToRender={5}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
        backgroundColor: '#FFFFFF',
    },
    dateButton: {
        width: '100%',
        backgroundColor: '#2355C4',
        paddingHorizontal: 17,
        paddingVertical: 12,
        borderRadius: 10,
        justifyContent: 'center',
        ...shadow,
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    clearDateButton: {
        alignSelf: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    clearDateText: {
        color: '#EF4444',
        fontSize: 14,
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        ...shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    cancelButton: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    doneButton: {
        fontSize: 16,
        color: '#2355C4',
        fontWeight: '600',
    },
    datePicker: {
        backgroundColor: '#FFFFFF',
        height: Platform.OS === 'ios' ? 200 : 'auto',
    },
    card: {
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        ...shadow,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
        lineHeight: 24,
    },
    date: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        lineHeight: 20,
    },
    scopeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    scopeImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        backgroundColor: '#E5E7EB',
    },
    scopeText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
        lineHeight: 22,
    },
    attendanceContainer: {
        paddingBottom: 4,
    },
    attendanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    attendanceText: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 20,
    },
});
