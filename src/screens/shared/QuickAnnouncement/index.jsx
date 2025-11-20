import NoData from '@/components/ui/NoData';
import QuickAnnouncementSkeleton from '@/components/loaders/skeletons/QuickAnnouncementSkeleton';
import { formatDateTime } from '@/functions';
import { useApi } from '@/hooks/useApi';
import { Bell } from 'lucide-react-native';
import { useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

export default function QuickAnnouncement() {
    const { data, request, loading } = useApi();

    useEffect(() => {
        request('quick_announcement/');
    }, [request]);

    return (
        <View style={styles.container}>
            {loading ? (
                <QuickAnnouncementSkeleton />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.headerRow}>
                                <Bell
                                    size={28}
                                    color="#1565C0"
                                    style={styles.margin}
                                />
                                <Text style={styles.headerText}>
                                    Шуурхай мэдэгдэл{' '}
                                    {formatDateTime(item.datetime)}
                                </Text>
                            </View>
                            <Text style={styles.message}>
                                {item.announcement}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={<NoData />}
                    contentContainerStyle={styles.flexgrow}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    card: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1565C0',
    },
    message: {
        fontSize: 15,
        color: '#000',
        lineHeight: 21,
    },
    margin: {
        marginRight: 8,
    },
    flexgrow: {
        flexGrow: 1,
    },
});
