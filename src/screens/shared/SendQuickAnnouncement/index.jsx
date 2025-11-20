import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native'; // lucide icon
import { COLORS, shadow } from '@/constants/theme';
import { useApi } from '@/hooks/useApi';

const SendQuickAnnouncement = () => {
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [announcement, setAnnouncement] = useState('');

    const {
        data: positions,
        loading: loadingPositions,
        request: fetchPositions,
    } = useApi();

    const { loading: posting, request: sendQuickAnnouncement } = useApi();

    useEffect(() => {
        fetchPositions('position/');
    }, [fetchPositions]);

    const showToast = message => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('Мэдээлэл', message);
        }
    };

    const openPositionSelector = () => {
        if (!positions || positions.length === 0) {
            showToast('Албан тушаал олдсонгүй');
            return;
        }

        Alert.alert(
            'Албан тушаал сонгох',
            'Нэгийг сонгоно уу:',
            positions.map(pos => ({
                text: pos.position_name,
                onPress: () => setSelectedPosition(pos),
            })),
        );
    };

    const sendNotification = async () => {
        if (!selectedPosition || !announcement.trim()) {
            showToast('Мэдээллийг бүрэн бөглөнө үү');
            return;
        }

        const now = new Date().toISOString().split('.')[0] + '+08:00';

        const body = {
            announcement,
            datetime: now,
            scope: [selectedPosition.id],
        };

        try {
            await sendQuickAnnouncement(
                'create_quick_announcement/',
                'POST',
                body,
            );
            showToast('Амжилттай зар илгээгдлээ');
            setAnnouncement('');
            setSelectedPosition(null);
        } catch (error) {
            console.error(error);
            showToast('Алдаа гарлаа. Дахин оролдоно уу.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loadingPositions ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <>
                    <Text style={styles.label}>Хамрах хүрээ</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={openPositionSelector}
                    >
                        <Text style={styles.pickerText}>
                            {selectedPosition
                                ? selectedPosition.position_name
                                : 'Сонгоно уу'}
                        </Text>
                        <ChevronDown size={20} color="#666" />
                    </TouchableOpacity>

                    <Text style={styles.label}>Зарын дэлгэрэнгүй</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={6}
                        placeholder="Илгээх зараа бичнэ үү..."
                        value={announcement}
                        onChangeText={setAnnouncement}
                        placeholderTextColor="#999"
                    />

                    {posting ? (
                        <ActivityIndicator
                            size="small"
                            color={COLORS.primary}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={sendNotification}
                        >
                            <Text style={styles.sendButtonText}>Илгээх</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </ScrollView>
    );
};

export default SendQuickAnnouncement;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111827',
    },
    pickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        padding: 14,
        marginBottom: 20,
        ...shadow,
    },
    pickerText: {
        fontSize: 16,
        color: '#111827',
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        padding: 16,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        color: '#111827',
        ...shadow,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 18,
        ...shadow,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});
