import { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    StyleSheet,
} from 'react-native';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

import dayjs from 'dayjs';
import { leaveTypes } from '@/lib/utils';
import { getUserInfo } from '@/functions';
import { useApi } from '@/hooks/useApi';
import { COLORS } from '../../../constants/theme';

const TypeOption = ({ id, label, selectedId, onSelect }) => (
    <TouchableOpacity
        style={[styles.typeOption, selectedId === id && styles.activeType]}
        onPress={() => onSelect(id)}
    >
        <Text
            style={[
                styles.typeText,
                selectedId === id && styles.activeTypeText,
            ]}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

export default function LeaveRequestSend({ navigation }) {
    const defaultStyles = useDefaultStyles();
    const { request } = useApi();

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [leaveType, setLeaveType] = useState(null);
    const [reason, setReason] = useState('');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const showAlert = (title, message, onOk) =>
        Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);

    const validate = () => {
        const today = dayjs().startOf('day');

        if (!startDate) return 'Эхлэх өдрөө сонгоно уу';
        if (!endDate) return 'Дуусах өдрөө сонгоно уу';
        if (leaveType === null) return 'Чөлөөний төрлөө сонгоно уу';
        if (endDate.isBefore(startDate))
            return 'Дуусах өдөр нь эхлэх өдрөөс эрт байж болохгүй';
        if (endDate.isBefore(today))
            return 'Дуусах өдөр нь өнөөдрөөс хойш байх ёстой';
        return null;
    };

    const submitRequest = async () => {
        const validationError = validate();
        if (validationError) return showAlert('❌ Алдаа', validationError);

        const user = await getUserInfo();
        if (!user?.memberId)
            return showAlert('❌ Алдаа', 'Хэрэглэгчийн мэдээлэл олдсонгүй');

        const payload = {
            member_id: user.memberId,
            start_date: startDate.format('YYYY-MM-DD'),
            end_date: endDate.format('YYYY-MM-DD'),
            request_type:
                leaveTypes.find(t => t.id === leaveType)?.label || 'Чөлөөтэй',
            description: reason.trim() || '',
        };

        try {
            await request('create_leave_request/', 'POST', payload);
            showAlert(
                '✅ Амжилттай',
                'Чөлөөний хүсэлт амжилттай илгээлээ',
                () => {
                    navigation?.goBack?.();
                },
            );
        } catch (err) {
            console.error(err);
            showAlert('❌ Алдаа', 'Сервертэй холбогдоход алдаа гарлаа');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Эхлэх өдөр сонгох</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {startDate
                            ? startDate.format('YYYY-MM-DD')
                            : 'Эхлэх өдөр сонгох'}
                    </Text>
                </TouchableOpacity>

                {showStartPicker && (
                    <View style={styles.datePickerContainer}>
                        <DateTimePicker
                            date={startDate}
                            onChange={params => {
                                setStartDate(dayjs(params.date));
                                setShowStartPicker(false);
                            }}
                            styles={{
                                ...defaultStyles,
                                today: {
                                    borderColor: COLORS.primary,
                                    borderWidth: 1,
                                },
                                selected: { backgroundColor: COLORS.primary },
                                selected_label: { color: 'white' },
                            }}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowStartPicker(false)}
                        >
                            <Text style={styles.closeButtonText}>Хаах</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Дуусах өдөр сонгох</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {endDate
                            ? endDate.format('YYYY-MM-DD')
                            : 'Дуусах өдөр сонгох'}
                    </Text>
                </TouchableOpacity>

                {showEndPicker && (
                    <View style={styles.datePickerContainer}>
                        <DateTimePicker
                            date={endDate}
                            onChange={params => {
                                setEndDate(dayjs(params.date));
                                setShowEndPicker(false);
                            }}
                            styles={{
                                ...defaultStyles,
                                today: {
                                    borderColor: COLORS.primary,
                                    borderWidth: 1,
                                },
                                selected: { backgroundColor: COLORS.primary },
                                selected_label: { color: 'white' },
                            }}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowEndPicker(false)}
                        >
                            <Text style={styles.closeButtonText}>Хаах</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Чөлөөний төрөл</Text>
                {leaveTypes.map(t => (
                    <TypeOption
                        key={t.id}
                        id={t.id}
                        label={t.label}
                        selectedId={leaveType}
                        onSelect={setLeaveType}
                    />
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Тайлбар</Text>
                <TextInput
                    placeholder="Шалтгааны талаар дэлгэрэнгүй... (заавал биш)"
                    multiline
                    numberOfLines={4}
                    value={reason}
                    onChangeText={setReason}
                    style={styles.textArea}
                />
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={submitRequest}
            >
                <Text style={styles.submitText}>Илгээх</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    section: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    datePickerContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    typeOption: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
    },
    activeType: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeText: { color: 'black' },
    activeTypeText: { color: 'white' },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
