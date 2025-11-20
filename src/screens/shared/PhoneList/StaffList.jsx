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
} from 'react-native';
import { Phone, Mail, Home, Copy } from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { COLORS } from '@/constants/theme';

export default function StaffList({ data }) {
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

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <View style={styles.headerRow}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>

            <View style={styles.contactRow}>
                <Phone size={16} color="#666" />

                <TouchableOpacity onPress={() => handleCopyPhone(item.phone)}>
                    <Text style={styles.contactText}>{item.phone}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleCopyPhone(item.phone)}
                    style={styles.iconBtn}
                >
                    <Copy size={16} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.contactRow}>
                <Mail size={16} color="#666" />

                <TouchableOpacity onPress={() => handleCopyEmail(item.email)}>
                    <Text style={styles.contactText}>{item.email}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleCopyEmail(item.email)}
                    style={styles.iconBtn}
                >
                    <Copy size={16} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.contactRow}>
                <Home size={16} color="#666" />
                <Text style={styles.contactText}>Өрөө: {item.room}</Text>
            </View>
        </View>
    );

    return (
        <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={<NoData />}
            contentContainerStyle={styles.container}
            renderItem={renderItem}
            // eslint-disable-next-line react/no-unstable-nested-components
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 12,
    },
    row: {
        paddingTop: 20,
        paddingHorizontal: 26,
        backgroundColor: COLORS.white,
        paddingBottom: 26,
    },
    headerRow: {
        marginBottom: 6,
    },
    username: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
    },
    status: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    contactText: {
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },
    iconBtn: {
        marginLeft: 10,
        padding: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#e5e5e5',
    },
});
