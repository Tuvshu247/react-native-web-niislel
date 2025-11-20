import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Trash2, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { COLORS, shadow } from '@/constants/theme';

export const LeaveRequestCard = ({ item, onDelete }) => {
    let statusColor = '#999';
    let StatusIcon = Clock;
    const isDeletable = item.status === 'Хүлээгдэж байна';

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

    const formattedCreatedAt = new Date(item.created_at).toLocaleDateString(
        'mn-MN',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    );

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.requestType}>{item.request_type}</Text>

                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: statusColor },
                        ]}
                    >
                        <StatusIcon
                            size={16}
                            color="#fff"
                            style={styles.statusIcon}
                        />
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    {isDeletable && onDelete && (
                        <TouchableOpacity
                            onPress={onDelete}
                            style={styles.deleteButton}
                        >
                            <Trash2 size={20} color="red" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Text style={styles.dateText}>
                Хугацаа: {item.start_date} → {item.end_date}
            </Text>
            <Text style={styles.dateText}>Илгээсэн: {formattedCreatedAt}</Text>
            {item.description ? (
                <Text style={styles.descriptionText}>
                    Тайлбар: {item.description}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.background,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        ...shadow,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    requestType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flexShrink: 1,
        paddingRight: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    statusIcon: {
        marginRight: 6,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    deleteButton: {
        marginLeft: 12,
    },
    dateText: {
        fontSize: 14,
        color: '#555',
        marginTop: 9,
    },
    descriptionText: {
        fontSize: 14,
        color: '#444',
        marginTop: 8,
        lineHeight: 20,
    },
});
