import NoData from '@/components/ui/NoData';
import { NewsCardSkeleton } from '@/components/loaders/skeletons/NewsCardSkeleton';
import { IMAGE_URL } from '@/constants/urls';
import { shadow } from '@/constants/theme';
import { useApi } from '@/hooks/useApi';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import {
    FlatList,
    Image,
    Linking,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';

export default function Statistics() {
    const { data, loading, request } = useApi();

    useEffect(() => {
        request('statistic/');
    }, [request]);

    const pdfItems = Array.isArray(data)
        ? data.filter(item => item.file_url?.endsWith('.pdf'))
        : [];

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.list}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <NewsCardSkeleton key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={pdfItems}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <StatisticItem item={item} />}
                    contentContainerStyle={styles.list}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    ListEmptyComponent={<NoData />}
                />
            )}
        </View>
    );
}

function StatisticItem({ item }) {
    const fileUrl = `${IMAGE_URL}${item.file_url}`;

    const handlePress = () => {
        Linking.openURL(fileUrl);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            <Image
                source={require('@/assets/images/pdf.png')}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <Text
                    style={styles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item.title}
                </Text>
                <Text style={styles.date}>
                    🗓 {dayjs(item.date).format('YYYY-MM-DD HH:mm')}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    list: {
        padding: 16,
        flexGrow: 1,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        ...shadow,
    },
    image: {
        width: 90,
        height: 110,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginRight: 12,
    },
    info: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    date: {
        fontSize: 13,
        color: '#999',
        marginTop: 6,
    },
});
