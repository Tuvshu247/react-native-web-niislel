import NoData from '@/components/ui/NoData';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ToastAndroid,
    Platform,
    Alert,
    Image,
} from 'react-native';
import { Phone, Mail, Copy } from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { IMAGE_URL } from '@/constants/urls';

export default function MemberList({ data }) {
    const showToast = msg => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            Alert.alert(msg);
        }
    };

    const handleCopyPhone = phone => {
        const text = String(phone);
        Clipboard.setString(text);
        showToast('Утасны дугаар хуулагдлаа!');
        Linking.openURL(`tel:${text}`);
    };

    const handleCopyEmail = email => {
        Clipboard.setString(email);
        showToast('И-мэйл хуулагдлаа!');
    };

    const renderItem = ({ item }) => {
        const avatar =
            item.profile_url && item.profile_url !== ''
                ? `${IMAGE_URL}${item.profile_url}`
                : null;

        return (
            <View style={styles.row}>
                <Image
                    source={
                        avatar
                            ? { uri: avatar }
                            : require('@/assets/images/default-user.png')
                    }
                    style={styles.avatar}
                />

                <View style={styles.textColumn}>
                    <Text style={styles.name}>
                        {item.last_name} {item.first_name}
                    </Text>

                    <View style={styles.contactRow}>
                        <Phone size={16} color="#777" />
                        <TouchableOpacity
                            onPress={() => handleCopyPhone(item.phone_number)}
                            style={styles.flexTapArea}
                        >
                            <Text style={styles.contactText}>
                                {item.phone_number}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleCopyPhone(item.phone_number)}
                            style={styles.copyIcon}
                        >
                            <Copy size={16} color="#777" />
                        </TouchableOpacity>
                    </View>

                    {item.email && (
                        <View style={styles.contactRow}>
                            <Mail size={16} color="#777" />
                            <TouchableOpacity
                                onPress={() => handleCopyEmail(item.email)}
                                style={styles.flexTapArea}
                            >
                                <Text style={styles.contactText}>
                                    {item.email}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleCopyEmail(item.email)}
                                style={styles.copyIcon}
                            >
                                <Copy size={16} color="#777" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={<NoData />}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            // eslint-disable-next-line react/no-unstable-nested-components
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 14,
        paddingHorizontal: 18,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 62,
        height: 62,
        borderRadius: 31,
        marginRight: 14,
        backgroundColor: '#e1e1e1',
        marginTop: 10,
    },
    textColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    flexTapArea: {
        marginLeft: 10,
        flexShrink: 1,
    },
    contactText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '400',
    },
    copyIcon: {
        padding: 6,
        marginLeft: 8,
        borderRadius: 6,
        backgroundColor: '#f4f4f4',
    },
    separator: {
        height: 1,
        backgroundColor: '#f1f1f1',
    },
});
