import NoData from '@/components/ui/NoData';
import { IMAGE_URL } from '@/constants/urls';
import { shadow } from '@/constants/theme';
import { formatDateTime } from '@/functions';
import { ChevronRight } from 'lucide-react-native';
import {
    FlatList,
    Image,
    Pressable,
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FutureMeetings({ data }) {
    const navigation = useNavigation();

    return (
        <FlatList
            data={data || []}
            keyExtractor={item => String(item?.id ?? Math.random())}
            contentContainerStyle={
                data?.length ? styles.listContainer : styles.container
            }
            renderItem={({ item }) => (
                <Pressable
                    onPress={() =>
                        navigation.navigate('MeetingHistoryDetail', {
                            id: String(item?.id),
                            data: item,
                        })
                    }
                    style={({ pressed }) => [
                        styles.card,
                        pressed && { backgroundColor: '#f0f0f0' },
                    ]}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.flex}>
                            <View style={styles.headerRow}>
                                <Image
                                    source={
                                        item?.meeting_type?.image_url
                                            ? {
                                                  uri: `${IMAGE_URL}${item.meeting_type.image_url}`,
                                              }
                                            : require('@/assets/images/default-image.png')
                                    }
                                    style={styles.icon}
                                />
                                <View style={styles.texts}>
                                    <Text
                                        style={styles.title}
                                        numberOfLines={1}
                                    >
                                        {item?.title ?? 'No title'}
                                    </Text>
                                    <Text
                                        style={styles.scope}
                                        numberOfLines={1}
                                    >
                                        {item?.meeting_type?.name ??
                                            'Тодорхойгүй'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.dateRow}>
                                <Text style={styles.label}>Эхэлсэн:</Text>
                                <Text style={styles.date}>
                                    {formatDateTime(item?.start_date)}
                                </Text>
                            </View>

                            <View style={styles.dateRow}>
                                <Text style={styles.label}>Дууссан:</Text>
                                <Text style={styles.date}>
                                    {formatDateTime(item?.end_date)}
                                </Text>
                            </View>
                        </View>

                        <ChevronRight
                            size={24}
                            color="#888"
                            style={styles.arrowIcon}
                        />
                    </View>
                </Pressable>
            )}
            ListEmptyComponent={<NoData />}
        />
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    listContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        ...shadow,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 10,
        backgroundColor: '#f2f2f2',
        borderColor: 'grey',
        borderWidth: 1,
        ...shadow,
    },
    texts: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    scope: {
        fontSize: 14,
        color: '#777',
    },
    dateRow: {
        flexDirection: 'row',
        marginTop: 6,
    },
    label: {
        fontWeight: '600',
        marginRight: 6,
        color: '#444',
    },
    date: {
        color: '#555',
    },
    arrowIcon: {
        marginLeft: 12,
    },
});
