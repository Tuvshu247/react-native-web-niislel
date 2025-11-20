import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Search, UserCircle } from 'lucide-react-native';
import LottieView from 'lottie-react-native';

import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import QuickAnnouncementSkeleton from '@/components/loaders/skeletons/QuickAnnouncementSkeleton';
import { IMAGE_URL } from '@/constants/urls';
import { getUserInfo } from '@/functions';
import { useChatApi } from '@/hooks/useChatApi';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { COLORS, shadow } from '@/constants/theme';
import { timeAgoMongolian } from '@/lib/utils';

const PROFILE_IMAGE_SIZE = 46;
const ICON_SIZE = 50;

const ChatItem = memo(({ item }) => {
    const navigation = useNavigation();

    const handlePress = useCallback(() => {
        navigation.navigate('DirectChat', {
            member: JSON.stringify(item.matchedMember),
            chatId: item.id,
        });
    }, [navigation, item.matchedMember, item.id]);

    const renderProfileImage = useMemo(() => {
        if (item.profile) {
            return (
                <Image
                    source={{ uri: `${IMAGE_URL}${item.profile}` }}
                    style={styles.profileImage}
                />
            );
        }
        return (
            <UserCircle
                size={ICON_SIZE}
                color={!item.seen ? COLORS.primary : '#bbb'}
                style={styles.fallbackIcon}
            />
        );
    }, [item.profile, item.seen]);

    const renderLastMessage = useMemo(() => {
        if (!item.last_chat?.message) return null;

        const messagePrefix =
            item.last_chat.status === 'илгээсэн' ? 'Та: ' : '';
        const messageText = `${messagePrefix}${item.last_chat.message} · ${item.timeAgo}`;

        return (
            <Text style={styles.lastChat} numberOfLines={1}>
                {messageText}
            </Text>
        );
    }, [item.last_chat, item.timeAgo]);

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <View
                style={[styles.itemContainer, !item.seen && styles.unseenItem]}
            >
                {renderProfileImage}

                <View style={styles.flex}>
                    <Text style={styles.name}>{item.name}</Text>
                    {renderLastMessage}
                </View>

                {!item.seen && (
                    <LottieView
                        source={require('@/assets/lottie/indicator.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
});

ChatItem.displayName = 'ChatItem';

const Chat = () => {
    const { data: chatServiceData, request: chatServiceRequest } = useChatApi();
    const { data: chatData, request: chatRequest } = useChatApi();
    const { data: membersData, request: membersRequest } = useChatApi();
    const { subscribe } = useWebSocket();
    const navigation = useNavigation();

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            try {
                const userInfo = await getUserInfo();
                if (userInfo?.userId && isMounted) {
                    await chatServiceRequest(
                        `/chat-service-user_id?user_id=${userInfo.userId}`,
                    );
                }
                if (isMounted) {
                    await membersRequest('/members');
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchInitialData();

        return () => {
            isMounted = false;
        };
    }, [chatServiceRequest, membersRequest]);

    useFocusEffect(
        useCallback(() => {
            if (!chatServiceData) return;
            const fetchChatData = async () => {
                try {
                    await chatRequest(`/chats?user_id=${chatServiceData}`);
                } catch (error) {
                    console.error('Error fetching chat data:', error);
                }
            };
            fetchChatData();
        }, [chatServiceData, chatRequest]),
    );

    useEffect(() => {
        if (!chatServiceData) return;

        const handleWebSocketUpdate = async () => {
            try {
                await chatRequest(`/chats?user_id=${chatServiceData}`);
            } catch (error) {
                console.error('Error handling WebSocket update:', error);
            }
        };

        const unsubscribe = subscribe(handleWebSocketUpdate);
        return unsubscribe;
    }, [chatServiceData, subscribe, chatRequest]);

    const members = useMemo(
        () => (Array.isArray(membersData) ? membersData : []),
        [membersData],
    );

    const enrichedChats = useMemo(() => {
        if (!Array.isArray(chatData)) return [];

        return chatData
            .map(chat => {
                const member = members.find(
                    m => m.user_id === chat.OtherUserID,
                );

                const name = member
                    ? `${member.last_name?.[0] || ''}.${
                          member.first_name || ''
                      }`
                    : chat.OtherUserEmail || 'Тодорхойгүй';

                const isSeen =
                    chat.LastMessageStatus === 'seen' ||
                    chat.LastMessageSenderID === chatServiceData;

                const lastMessageCreatedAt =
                    chat.LastMessageCreatedAt || new Date().toISOString();

                return {
                    id: chat.ChatID?.toString() || `chat_${Math.random()}`,
                    name,
                    profile:
                        member?.profile || chat.OtherUserProfilePicture || null,
                    seen: isSeen,
                    last_chat: {
                        message: chat.LastMessageContent || '',
                        status:
                            chat.LastMessageSenderID === chatServiceData
                                ? 'илгээсэн'
                                : 'хүлээн авсан',
                        created_at: lastMessageCreatedAt,
                    },
                    matchedMember: member,
                    timeAgo: timeAgoMongolian(lastMessageCreatedAt),
                };
            })
            .sort(
                (a, b) =>
                    new Date(b.last_chat.created_at) -
                    new Date(a.last_chat.created_at),
            );
    }, [chatData, members, chatServiceData]);

    const existingUserIds = useMemo(
        () => enrichedChats.map(chat => chat.matchedMember?.id).filter(Boolean),
        [enrichedChats],
    );

    const filteredChats = useMemo(() => {
        const searchTerm = search.toLowerCase().trim();
        if (!enrichedChats.length) return [];

        if (!searchTerm) return enrichedChats;
        return enrichedChats.filter(item =>
            item.name.toLowerCase().includes(searchTerm),
        );
    }, [enrichedChats, search]);

    const handleAddPress = useCallback(() => {
        navigation.navigate('Screen', {
            screen: 'AddChatUsers',
            params: { existingUserIds: existingUserIds || [] },
        });
    }, [navigation, existingUserIds]);

    const handleSearchChange = useCallback(text => setSearch(text), []);

    const renderChatItem = useCallback(
        ({ item }) => <ChatItem item={item} />,
        [],
    );
    const keyExtractor = useCallback(item => item.id, []);

    if (loading) {
        return (
            <ScreenWrapper headerText="Зурвас">
                <View style={styles.marginTopCustom} />
                <QuickAnnouncementSkeleton />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper headerText="Зурвас">
            <TouchableOpacity
                onPress={handleAddPress}
                style={styles.addButton}
                activeOpacity={0.8}
            >
                <Plus size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.marginTopCustom} />

            <View style={styles.searchContainer}>
                <Search size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Хайх..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={handleSearchChange}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                />
            </View>

            <View style={styles.listContainer}>
                {filteredChats.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {search
                                ? 'Хайлт олдсонгүй'
                                : 'Зурвас байхгүй байна'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredChats}
                        keyExtractor={keyExtractor}
                        renderItem={renderChatItem}
                        removeClippedSubviews
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

export default Chat;

const styles = StyleSheet.create({
    marginTopCustom: { marginTop: 20 },
    flex: { flex: 1 },
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
    listContainer: {
        marginHorizontal: 16,
        marginBottom: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    unseenItem: { backgroundColor: '#F0F4FF' },
    lottie: { width: 28, height: 28, marginLeft: 6 },
    name: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
    lastChat: { fontSize: 14, color: '#777', flex: 1 },
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: COLORS.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadow,
        zIndex: 99,
        elevation: 8,
    },
    profileImage: {
        width: PROFILE_IMAGE_SIZE,
        height: PROFILE_IMAGE_SIZE,
        borderRadius: PROFILE_IMAGE_SIZE / 2,
        marginRight: 14,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.separatorLine,
    },
    fallbackIcon: { marginRight: 14 },
});
