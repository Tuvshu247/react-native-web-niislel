/* eslint-disable react/no-unstable-nested-components */
import { formatDateTime } from '@/functions';
import { ATTENDANCE_COLORS, ATTENDANCE_LABELS } from '@/lib/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/mn';
import { useState, useMemo, useCallback } from 'react';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,
    Modal,
} from 'react-native';
import { shadow } from '@/constants/theme';

export default function MemberReport({ data }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const safeData = Array.isArray(data) ? data : [];

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [showMeetingModal, setShowMeetingModal] = useState(false);

    const meetingNames = useMemo(() => {
        const names = safeData
            .filter(i => i && i.meeting_name)
            .map(i => i.meeting_name);
        return [...new Set(names)];
    }, [safeData]);

    const sortedAttendance = useMemo(() => {
        return [...safeData].sort(
            (a, b) =>
                new Date(b?.created_at)?.getTime() -
                new Date(a?.created_at)?.getTime(),
        );
    }, [safeData]);

    const filteredAttendance = useMemo(() => {
        let list = sortedAttendance;

        if (selectedDate) {
            const d = dayjs(selectedDate);
            list = list.filter(i => dayjs(i.created_at).isSame(d, 'day'));
        }

        if (selectedMeeting) {
            list = list.filter(i => i.meeting_name === selectedMeeting);
        }

        return list;
    }, [sortedAttendance, selectedDate, selectedMeeting]);

    const handleDateChange = useCallback((event, date) => {
        if (Platform.OS === 'android') setShowPicker(false);
        if (date) setSelectedDate(date);
    }, []);

    const renderItem = useCallback(({ item }) => {
        const statusKey = String(item.status);
        const label = ATTENDANCE_LABELS[statusKey] || 'Тодорхойгүй';
        const color = ATTENDANCE_COLORS[statusKey] || '#999';

        return (
            <View style={styles.row}>
                <View style={styles.cellLarge}>
                    <Text style={styles.text} numberOfLines={2}>
                        {item.meeting_name}
                    </Text>
                </View>

                <View style={styles.cellMedium}>
                    <Text style={styles.text}>
                        {formatDateTime(item.created_at)}
                    </Text>
                </View>

                <View style={[styles.cellSmall, { backgroundColor: color }]}>
                    <Text
                        style={[styles.text, styles.statusText]}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                </View>
            </View>
        );
    }, []);

    const keyExtractor = useCallback(item => String(item.id), []);

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowPicker(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {selectedDate
                            ? dayjs(selectedDate).format('M-р сарын D-н')
                            : 'Огноогоор шүүх'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.dateButton, styles.meetingButton]}
                    onPress={() => setShowMeetingModal(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {selectedMeeting || 'Хурлаар шүүх'}
                    </Text>
                </TouchableOpacity>

                {(selectedDate || selectedMeeting) && (
                    <TouchableOpacity
                        style={styles.clearDateButton}
                        onPress={() => {
                            setSelectedDate(null);
                            setSelectedMeeting(null);
                        }}
                    >
                        <Text style={styles.clearDateText}>
                            Шүүлтүүр цэвэрлэх
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {showPicker && (
                <Modal
                    visible={showPicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowPicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity
                            style={styles.modalBackground}
                            onPress={() => setShowPicker(false)}
                        />
                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(false)}
                                >
                                    <Text style={styles.cancelButton}>
                                        Болих
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.pickerTitle}>
                                    Огноо сонгох
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(false)}
                                >
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
                                maximumDate={new Date()}
                                onChange={handleDateChange}
                                style={styles.datePicker}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            <Modal
                visible={showMeetingModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMeetingModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Хурал сонгох</Text>

                        {meetingNames.map((name, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.modalItem}
                                onPress={() => {
                                    setSelectedMeeting(name);
                                    setShowMeetingModal(false);
                                }}
                            >
                                <Text style={styles.modalItemText}>{name}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.modalCancel}
                            onPress={() => setShowMeetingModal(false)}
                        >
                            <Text style={styles.modalCancelText}>Болих</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={filteredAttendance}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <Text style={styles.empty}>Ирцийн мэдээлэл алга байна</Text>
                )}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <View style={styles.cellLarge}>
                            <Text style={[styles.text, styles.headerText]}>
                                Хурлын нэр
                            </Text>
                        </View>
                        <View style={styles.cellMedium}>
                            <Text style={[styles.text, styles.headerText]}>
                                Огноо
                            </Text>
                        </View>
                        <View style={styles.cellSmall}>
                            <Text style={[styles.text, styles.headerText]}>
                                Ирц
                            </Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                initialNumToRender={10}
                windowSize={10}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fff' },
    filterContainer: { alignItems: 'center', marginBottom: 16 },
    dateButton: {
        width: '100%',
        backgroundColor: '#2355C4',
        paddingVertical: 12,
        borderRadius: 10,
        ...shadow,
    },
    meetingButton: { backgroundColor: '#0D9488', marginTop: 10 },
    dateButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    clearDateButton: { marginTop: 8 },
    clearDateText: {
        color: '#EF4444',
        textDecorationLine: 'underline',
        fontWeight: '500',
        fontSize: 14,
    },
    listContainer: { paddingBottom: 24, flexGrow: 1 },
    header: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        minHeight: 50,
    },
    cellLarge: {
        flex: 2,
        padding: 10,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#E5E7EB',
    },
    cellMedium: {
        flex: 1.5,
        padding: 10,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#E5E7EB',
    },
    cellSmall: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: { fontSize: 13, color: '#111827' },
    headerText: { fontWeight: '600', fontSize: 14 },
    statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    empty: {
        paddingVertical: 40,
        textAlign: 'center',
        color: '#9CA3AF',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    modalBackground: { flex: 1 },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 40,
        padding: 20,
        borderRadius: 12,
        ...shadow,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalItemText: { fontSize: 15, color: '#111' },
    modalCancel: { marginTop: 15, alignItems: 'center' },
    modalCancelText: { fontSize: 16, color: '#EF4444', fontWeight: '500' },
    pickerContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        ...shadow,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    pickerTitle: { fontSize: 18, fontWeight: '600' },
    cancelButton: { fontSize: 16, color: '#6B7280' },
    doneButton: { fontSize: 16, color: '#2355C4', fontWeight: '600' },
    datePicker: { backgroundColor: '#fff' },
});
