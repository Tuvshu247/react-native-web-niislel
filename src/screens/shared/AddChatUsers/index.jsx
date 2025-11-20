import { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Search } from 'lucide-react-native';

import NoData from '@/components/ui/NoData';
import ChatMemberSkeleton from '@/components/loaders/skeletons/QuickAnnouncementSkeleton';
import { IMAGE_URL } from '@/constants/urls';
import { getUserInfo } from '@/functions';
import { useChatApi } from '@/hooks/useChatApi';
import { shadow } from '@/constants/theme';

export default function AddChatUsers() {
    const navigation = useNavigation();
    const route = useRoute();
    const { existingUserIds } = route.params || {};

    const { data, request, loading } = useChatApi();
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        getUserInfo().then(info => {
            setCurrentUserId(info?.memberId || null);
        });
    }, []);

    const parsedIds = useMemo(() => {
        if (!existingUserIds) return [];
        return Array.isArray(existingUserIds)
            ? existingUserIds
            : typeof existingUserIds === 'string'
            ? JSON.parse(existingUserIds)
            : [];
    }, [existingUserIds]);

    useEffect(() => {
        request('members');
    }, [request]);

    useEffect(() => {
        if (!data) return;

        const filtered = data.filter(
            item =>
                item &&
                !parsedIds.includes(item.id) &&
                item.id.toString() !== currentUserId,
        );
        setFilteredData(filtered);
    }, [data, parsedIds, currentUserId]);

    useEffect(() => {
        if (!data) return;

        const keyword = search.trim().toLowerCase();

        const filtered = data.filter(item => {
            if (!item) return false;
            if (parsedIds.includes(item.id)) return false;
            if (item.id.toString() === currentUserId) return false;
            if (!keyword) return true;
            return (
                item.lettered_name?.toLowerCase().includes(keyword) ||
                item.email?.toLowerCase().includes(keyword)
            );
        });

        setFilteredData(filtered);
    }, [search, data, parsedIds, currentUserId]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate('DirectChat', {
                    member: JSON.stringify(item),
                })
            }
            activeOpacity={0.7}
        >
            <Image
                source={
                    item.profile
                        ? { uri: `${IMAGE_URL}${item.profile}` }
                        : require('@/assets/images/default-user.png')
                }
                style={styles.avatar}
            />
            <View style={styles.info}>
                <Text style={styles.name}>
                    {item.last_name[0]}.{item.first_name}
                </Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.phone}>{item.phone_number}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Хайх..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            {loading ? (
                [...Array(6)].map((_, i) => <ChatMemberSkeleton key={i} />)
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listPadding}
                    ListEmptyComponent={<NoData />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listPadding: { paddingBottom: 10 },
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        marginHorizontal: 16,
        paddingHorizontal: 10,
        marginBottom: 18,
        ...shadow,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        fontSize: 16,
        color: '#000',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        ...shadow,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        backgroundColor: '#E5E7EB',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    email: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    phone: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 1,
    },
});
