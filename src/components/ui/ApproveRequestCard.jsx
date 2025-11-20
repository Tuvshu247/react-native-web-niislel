import { COLORS, shadow } from '@/constants/theme';
import { IMAGE_URL } from '@/constants/urls';
import { ATTENDANCE_COLORS } from '@/lib/utils';
import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Clock, CheckCircle2, XCircle, Pencil } from 'lucide-react-native';

export default function ApproveRequestCard({ item }) {
    const navigation = useNavigation();

    const formattedCreatedAt = new Date(item.created_at).toLocaleDateString(
        'mn-MN',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    );

    let statusColor = '#999';
    let StatusIcon = Clock;

    switch (item.status) {
        case 'Хүлээгдэж байна':
            statusColor = '#FF9800';
            StatusIcon = Clock;
            break;
        case 'Зөвшөөрсөн':
            statusColor = '#4CAF50';
            StatusIcon = CheckCircle2;
            break;
        case 'Татгалзсан':
            statusColor = '#F44336';
            StatusIcon = XCircle;
            break;
    }

    const profileUri = `${IMAGE_URL}${item.profile}`;

    const handleEdit = () => {
        navigation.navigate('EditRequest', {
            data: JSON.stringify(item),
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.profileWrapper}>
                    <Image
                        source={{ uri: profileUri }}
                        style={styles.profile}
                    />
                    <Text style={styles.name}>{item.lettered_name}</Text>
                </View>
                <TouchableOpacity onPress={handleEdit}>
                    <Pencil size={22} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <Text style={styles.dateText}>
                    Хугацаа : {item.start_date} → {item.end_date}
                </Text>
            </View>

            <Text style={styles.dateText}>Илгээсэн : {formattedCreatedAt}</Text>

            <View style={styles.typeRow}>
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor:
                                ATTENDANCE_COLORS[String(item.request_type)] ||
                                '#999',
                        },
                    ]}
                />
                <Text style={styles.requestType}>{item.request_type}</Text>
            </View>

            <View
                style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
                <StatusIcon
                    size={16}
                    color="#fff"
                    style={styles.marginCustom}
                />
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    marginCustom: {
        marginRight: 6,
    },
    card: {
        backgroundColor: COLORS.background,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        ...shadow,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    profile: {
        width: 56,
        height: 56,
        borderRadius: 38,
        backgroundColor: '#eee',
        borderColor: COLORS.white,
        borderWidth: 1,
    },
    name: {
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        marginTop: 12,
    },
    dateText: {
        fontSize: 13,
        color: '#555',
        marginBottom: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 50,
        marginTop: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    requestType: {
        fontSize: 14,
        fontWeight: '500',
    },
    typeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
