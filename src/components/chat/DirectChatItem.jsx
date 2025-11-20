/* eslint-disable react-native/no-inline-styles */
import { IMAGE_URL } from '@/constants/urls';
import { Image, Text, View, StyleSheet } from 'react-native';
import { COLORS, shadow } from '@/constants/theme';

export const DirectChatItem = ({
    item,
    member,
    showAvatar,
    isFirstInGroup,
    isLastInGroup,
}) => {
    const isMe = item.sender === 'me';

    return (
        <View
            style={[
                styles.messageContainer,
                isMe ? styles.myMessage : styles.theirMessage,
                isLastInGroup && { marginBottom: 12 },
                { flexDirection: 'row', alignItems: 'flex-end' },
            ]}
        >
            {!isMe ? (
                <View style={styles.avatarContainer}>
                    {showAvatar ? (
                        <Image
                            source={
                                member?.profile
                                    ? { uri: `${IMAGE_URL}${member.profile}` }
                                    : require('@/assets/images/default-user.png')
                            }
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder} />
                    )}
                </View>
            ) : null}

            <View
                style={[
                    styles.bubble,
                    isMe ? styles.myBubble : styles.theirBubble,
                    isFirstInGroup && isLastInGroup && styles.singleBubble,
                    isFirstInGroup &&
                        !isLastInGroup &&
                        (isMe ? styles.firstBubble : styles.otherFirstBubble),
                    !isFirstInGroup &&
                        !isLastInGroup &&
                        (isMe ? styles.middleBubble : styles.otherMiddleBubble),
                    !isFirstInGroup &&
                        isLastInGroup &&
                        (isMe ? styles.lastBubble : styles.otherLastBubble),
                ]}
            >
                <Text
                    style={
                        isMe ? styles.myMessageText : styles.theirMessageText
                    }
                >
                    {item.text}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    chatList: {
        padding: 8,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 1,
    },
    messageContainerLastInGroup: {
        marginBottom: 12,
    },
    myMessage: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
    },
    singleBubble: {
        borderRadius: 20,
    },
    firstBubble: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 4,
    },
    otherFirstBubble: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 20,
    },
    middleBubble: {
        borderRadius: 4,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    otherMiddleBubble: {
        borderRadius: 4,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    lastBubble: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    otherLastBubble: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    bubble: {
        maxWidth: '75%',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    myBubble: {
        backgroundColor: COLORS.primary,
    },
    theirBubble: {
        backgroundColor: '#e5e5ea',
        marginLeft: 5,
    },
    myMessageText: {
        color: COLORS.white,
        fontSize: 16,
    },
    theirMessageText: {
        color: COLORS.black,
        fontSize: 16,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        ...shadow,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        backgroundColor: 'transparent',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        maxHeight: 100,
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        marginRight: 10,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    headerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        ...shadow,
    },
    headerUsername: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
    },
});
