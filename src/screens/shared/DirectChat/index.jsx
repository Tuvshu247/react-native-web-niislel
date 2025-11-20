import { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { DirectChatInputBar } from '@/components/chat/DirectChatInputBar';
import { DirectChatItem } from '@/components/chat/DirectChatItem';
import { COLORS } from '@/constants/theme';
import { getUserInfo } from '@/functions';
import { useChatApi } from '@/hooks/useChatApi';
import { useDirectChat } from '@/hooks/useDirectChat';
import { useUnread } from '@/contexts/UnreadContext';

export default function DirectChat({ route }) {
    const { refreshUnread } = useUnread();
    const { member, chatId } = route.params;
    const { parsedMember, messages, input, setInput, handleSend } =
        useDirectChat(chatId, member);
    const { request } = useChatApi();
    const flatListRef = useRef(null);

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserInfo();
            if (user) setUserId(user.userId);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!userId) return;
        request(
            `change-last-message-status?chat_id=${chatId}&user_id=${userId}`,
        );
        refreshUnread();
    }, [chatId, request, userId, refreshUnread]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar
                translucent
                backgroundColor={COLORS.white}
                barStyle="dark-content"
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}
            >
                <ChatHeader member={parsedMember} />

                <FlatList
                    ref={flatListRef}
                    data={[...messages].reverse()}
                    inverted
                    renderItem={({ item, index }) => {
                        const messagesReversed = [...messages].reverse();
                        const prevMessage = messagesReversed[index - 1];
                        const nextMessage = messagesReversed[index + 1];

                        const isFirstInGroup =
                            !nextMessage || nextMessage.sender !== item.sender;
                        const isLastInGroup =
                            !prevMessage || prevMessage.sender !== item.sender;

                        return (
                            <DirectChatItem
                                item={item}
                                member={parsedMember}
                                showAvatar={isLastInGroup}
                                isFirstInGroup={isFirstInGroup}
                                isLastInGroup={isLastInGroup}
                            />
                        );
                    }}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                />

                <DirectChatInputBar
                    input={input}
                    setInput={setInput}
                    onSend={() => {
                        handleSend();
                        setTimeout(
                            () =>
                                flatListRef.current?.scrollToOffset({
                                    offset: 0,
                                    animated: true,
                                }),
                            100,
                        );
                    }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    listContent: {
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
});
