import { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { MenuItem } from '@/components/ui/MenuItem';
import { IMAGE_URL } from '@/constants/urls';
import { getUserInfo } from '@/functions';
import { LogOut } from 'lucide-react-native';
import { COLORS, shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function MenuScreen() {
    const [userInfo, setUserInfo] = useState(null);
    const { logout } = useAuth();

    const getUser = async () => {
        const user = await getUserInfo();
        if (user) setUserInfo(user);
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Image
                    source={
                        userInfo?.profile
                            ? { uri: `${IMAGE_URL}${userInfo.profile}` }
                            : require('@/assets/images/default-user.png')
                    }
                    resizeMode="cover"
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.lastName}>{userInfo?.lastName}</Text>
                    <Text style={styles.firstName}>{userInfo?.firstName}</Text>
                    <Text style={styles.position}>👜 {userInfo?.position}</Text>
                </View>
            </View>

            <ScrollView style={styles.menuSection}>
                <Text style={styles.sectionTitle}>ДЭЛГЭРЭНГҮЙ МЭДЭЭЛЭЛ</Text>
                <MenuItem
                    icon="Archive"
                    label="Хуралдааны түүх"
                    path="MeetingHistory"
                />
                <MenuItem
                    icon="Bell"
                    label="Шуурхай зар"
                    path="QuickAnnouncement"
                />
                <MenuItem
                    icon="Laptop"
                    label="Цахим хурал"
                    path="DigitalMeeting"
                />
                <MenuItem
                    icon="Users"
                    label="Ирцийн мэдээ"
                    path="AttendanceReport"
                />
                <MenuItem icon="Image" label="Зургийн цомог" path="Gallery" />
                <MenuItem
                    icon="BarChart2"
                    label="Статистик мэдээлэл"
                    path="Statistics"
                />
                <MenuItem
                    icon="Phone"
                    label="Утасны жагсаалт"
                    path="PhoneList"
                />

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => logout()}
                >
                    <LogOut size={20} color="#fff" />
                    <Text style={styles.logoutText}>Системээс гарах</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: 60,
    },
    logo: {
        width: 160,
        height: 160,
        position: 'absolute',
        right: 20,
        opacity: 0.1,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.white,
        marginRight: 30,
        marginLeft: 10,
        borderColor: COLORS.white,
        borderWidth: 2,
    },
    lastName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
        textTransform: 'uppercase',
    },
    firstName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    position: {
        color: COLORS.white,
        marginTop: 4,
    },
    menuSection: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: 40,
        paddingBottom: 20,
        ...shadow,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 10,
        color: '#1E67D2',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    menuText: {
        marginLeft: 14,
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        marginVertical: 24,
        backgroundColor: COLORS.primary,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'center',
    },
    logoutText: {
        color: COLORS.white,
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
