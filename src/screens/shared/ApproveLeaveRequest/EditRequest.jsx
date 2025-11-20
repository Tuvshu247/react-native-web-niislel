/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, shadow } from '@/constants/theme';
import { IMAGE_URL } from '@/constants/urls';
import { useApi } from '@/hooks/useApi';
import { Clock, CheckCircle, XCircle } from 'lucide-react-native';

export default function EditRequest() {
    const navigation = useNavigation();
    const route = useRoute();
    const { data } = route.params || {};

    const [loading, setLoading] = useState(false);
    const { request } = useApi();

    let item = {};
    try {
        item = JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse item data:', e);
    }

    const handleAction = async status => {
        if (!item.id) return;

        setLoading(true);
        try {
            const payload = {
                leave_request_id: item.id,
                status: status === 'approve' ? 'Зөвшөөрсөн' : 'Татгалзсан',
            };

            await request('leave_request_approval/', 'PUT', payload);

            Alert.alert(
                'Мэдэгдэл',
                `Чөлөөний хүсэлтийг ${
                    status === 'approve' ? 'зөвшөөрлөө' : 'татгалзлаа'
                }.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }],
            );
        } catch (err) {
            console.error(err);
            Alert.alert('Алдаа', 'Алдаа гарлаа та түр хүлээнэ үү!', [
                { text: 'OK' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    let statusColor = '#999';
    let StatusIcon = Clock;

    switch (item.status) {
        case 'Хүлээгдэж байна':
            statusColor = '#FF9800';
            StatusIcon = Clock;
            break;
        case 'Зөвшөөрсөн':
            statusColor = '#4CAF50';
            StatusIcon = CheckCircle;
            break;
        case 'Татгалзсан':
            statusColor = '#F44336';
            StatusIcon = XCircle;
            break;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <View style={styles.profileContainer}>
                    <Image
                        source={{ uri: `${IMAGE_URL}${item.profile}` }}
                        style={styles.imageSmall}
                    />
                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.label}>👤 Хэрэглэгч</Text>
                        <Text style={styles.value}>{item.lettered_name}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>📅 Эхлэх хугацаа</Text>
                <Text style={styles.value}>{item.start_date}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>📅 Дуусах хугацаа</Text>
                <Text style={styles.value}>{item.end_date}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>📨 Одоогийн төлөв</Text>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor },
                    ]}
                >
                    <StatusIcon
                        size={18}
                        color="#fff"
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>📋 Чөлөөний төрөл</Text>
                <Text style={styles.value}>{item.request_type}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Тайлбар:</Text>
                <Text style={styles.value}>{item.description}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'green' }]}
                    onPress={() => handleAction('approve')}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Зөвшөөрөх</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'red' }]}
                    onPress={() => handleAction('reject')}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Татгалзах</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        minHeight: '100%',
    },
    section: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
        ...shadow,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
        fontWeight: '600',
    },
    value: {
        fontSize: 16,
        color: '#111',
        fontWeight: '500',
    },
    imageSmall: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        ...shadow,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
