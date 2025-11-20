/* eslint-disable react-hooks/exhaustive-deps */
import AttendanceHomeBlock from '@/components/ui/AttendanceHomeBlock';
import MenuInfoGrid from '@/components/ui/MenuInfoGrid';
import ScheduleScreen from '@/components/ui/Schedule';
import { COLORS, shadow } from '@/constants/theme';
import { IMAGE_URL } from '@/constants/urls';
import { getUserInfo } from '@/functions';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFcm } from '@/hooks/useFcm';
import { Briefcase, Megaphone } from 'lucide-react-native';
import { useNotifUnseen } from '@/contexts/NotifUnseenContext';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const DATA = ['header', 'button', 'schedule', 'menu', 'attendance'];

export default function Home() {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState(null);
    const { refresh } = useNotifUnseen();
    useFcm();

    const getUser = async () => {
        const user = await getUserInfo();
        if (user) {
            setUserInfo(user);
        }
    };

    useEffect(() => {
        getUser();
        refresh();
    }, []);

    const renderItem = ({ item }) => {
        switch (item) {
            case 'header':
                return (
                    <ImageBackground
                        source={require('@/assets/images/big_header.png')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    >
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <View style={styles.profileSection}>
                            <Image
                                source={
                                    userInfo?.profile
                                        ? {
                                              uri: `${IMAGE_URL}${userInfo.profile}`,
                                          }
                                        : require('@/assets/images/default-user.png')
                                }
                                resizeMode="cover"
                                style={styles.avatar}
                            />

                            <View style={styles.profileTextContainer}>
                                <Text style={styles.lastName}>
                                    {userInfo?.lastName}
                                </Text>
                                <Text style={styles.firstName}>
                                    {userInfo?.firstName}
                                </Text>
                                <Text style={styles.position}>
                                    👜 {userInfo?.position}
                                </Text>
                                <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={() =>
                                        navigation.navigate('UserProfile')
                                    }
                                >
                                    <Text style={styles.detailButtonText}>
                                        дэлгэрэнгүй мэдээлэл
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                );
            case 'button':
                return (
                    <View style={localStyles.container}>
                        <View style={localStyles.buttonContainer}>
                            <TouchableOpacity
                                style={localStyles.button}
                                onPress={() =>
                                    navigation.navigate('Screen', {
                                        screen: 'ApproveLeaveRequest',
                                    })
                                }
                            >
                                <Briefcase
                                    size={isTablet ? 40 : 32}
                                    color="white"
                                    style={localStyles.icon}
                                />
                                <Text style={localStyles.text}>
                                    Чөлөөний хүсэлт шийдвэрлэх
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={localStyles.button}
                                onPress={() =>
                                    navigation.navigate('Screen', {
                                        screen: 'SendQuickAnnouncement',
                                    })
                                }
                            >
                                <Megaphone
                                    size={isTablet ? 40 : 32}
                                    color="white"
                                    style={localStyles.icon}
                                />
                                <Text style={localStyles.text}>
                                    Шуурхай зарлал илгээх
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case 'schedule':
                return <ScheduleScreen />;
            case 'menu':
                return <MenuInfoGrid />;
            case 'attendance':
                return <AttendanceHomeBlock />;
            default:
                return null;
        }
    };

    return (
        <>
            <StatusBar translucent backgroundColor={COLORS.primary} />
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item}
                showsVerticalScrollIndicator={false}
            />
        </>
    );
}

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingVertical: isTablet ? 24 : 16,
    },
    buttonContainer: {
        flexDirection: isTablet ? 'row' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: isTablet ? 32 : 16,
        gap: isTablet ? 20 : 12,
        maxWidth: isTablet ? 800 : '100%',
        alignSelf: 'center',
    },
    icon: {
        marginRight: isTablet ? 18 : 14,
        color: COLORS.white,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: isTablet ? 18 : 12,
        paddingHorizontal: isTablet ? 24 : 18,
        height: isTablet ? 90 : Platform.OS === 'ios' ? 70 : undefined,
        backgroundColor: 'green',
        borderRadius: isTablet ? 16 : 12,
        width: isTablet ? '48%' : '48%',
        ...shadow,
        minHeight: isTablet ? 90 : 60,
    },
    text: {
        fontSize: isTablet ? 14 : 11,
        color: COLORS.white,
        fontWeight: '700',
        textTransform: 'uppercase',
        flexShrink: 1,
        textAlign: 'center',
        lineHeight: isTablet ? 18 : 14,
    },
});

const styles = StyleSheet.create({
    headerImage: {
        height: isTablet ? 350 : 280,
        justifyContent: 'center',
        position: 'relative',
        marginTop: -30,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: isTablet ? 200 : 160,
        height: isTablet ? 200 : 160,
        position: 'absolute',
        right: isTablet ? 40 : 20,
        top: isTablet ? 90 : 70,
        opacity: 0.1,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: isTablet ? 40 : 20,
        marginTop: isTablet ? 40 : 30,
        maxWidth: isTablet ? 800 : '100%',
        alignSelf: isTablet ? 'center' : 'flex-start',
        width: '100%',
    },
    profileTextContainer: {
        flex: 1,
        marginLeft: isTablet ? 24 : 16,
    },
    avatar: {
        width: isTablet ? 200 : 120,
        height: isTablet ? 200 : 120,
        borderRadius: isTablet ? 75 : 60,
        borderColor: COLORS.white,
        borderWidth: isTablet ? 3 : 2,
        backgroundColor: COLORS.white,
    },
    lastName: {
        fontSize: isTablet ? 20 : 16,
        fontWeight: 'bold',
        color: COLORS.white,
        textTransform: 'uppercase',
    },
    firstName: {
        fontSize: isTablet ? 24 : 18,
        fontWeight: 'bold',
        color: COLORS.white,
        textTransform: 'uppercase',
        marginBottom: isTablet ? 12 : 8,
    },
    position: {
        fontSize: isTablet ? 18 : 14,
        marginTop: isTablet ? 6 : 4,
        color: COLORS.white,
    },
    detailButton: {
        marginTop: isTablet ? 16 : 8,
        backgroundColor: 'green',
        paddingHorizontal: isTablet ? 18 : 12,
        paddingVertical: isTablet ? 10 : 6,
        borderRadius: isTablet ? 8 : 6,
        alignSelf: 'flex-start',
    },
    detailButtonText: {
        color: COLORS.white,
        fontSize: isTablet ? 16 : 12,
        fontWeight: isTablet ? '600' : 'normal',
    },
    greenButton: {
        backgroundColor: 'green',
        padding: isTablet ? 20 : 14,
        borderRadius: isTablet ? 14 : 10,
        marginHorizontal: isTablet ? 32 : 16,
        marginVertical: isTablet ? 32 : 22,
        maxWidth: isTablet ? 600 : '100%',
        alignSelf: 'center',
    },
    greenButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: isTablet ? 18 : 16,
    },
});
