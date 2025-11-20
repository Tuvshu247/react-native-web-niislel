import {
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useNavigationMode } from 'react-native-navigation-mode';

export const DirectChatInputBar = ({ input, setInput, onSend }) => {
    const { navigationMode } = useNavigationMode();

    const isGestureNav = navigationMode?.isGestureNavigation ?? false;
    const navHeight = navigationMode?.navigationBarHeight || 0;

    const bottomSpacing =
        Platform.OS === 'android' ? (isGestureNav ? navHeight - 10 : 12) : 30;

    return (
        <View style={[styles.wrapper, { paddingBottom: bottomSpacing }]}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Мессеж бичих..."
                    value={input}
                    onChangeText={setInput}
                    multiline
                    maxLength={5000}
                    scrollEnabled
                />

                <TouchableOpacity onPress={onSend} style={styles.sendButton}>
                    <Send size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 28,
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },

    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 0,
        paddingVertical: 0,
        maxHeight: 120,
        color: '#222',
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        width: 46,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});
