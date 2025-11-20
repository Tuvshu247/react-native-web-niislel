/* eslint-disable react-hooks/exhaustive-deps */
import AttendanceHomeBlock from '@/components/ui/AttendanceHomeBlock';
import MenuInfoGrid from '@/components/ui/MenuInfoGrid';
import ScheduleScreen from '@/components/ui/Schedule';
import { COLORS } from '@/constants/theme';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFcm } from '@/hooks/useFcm';
import { useNotifUnseen } from '@/contexts/NotifUnseenContext';

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

                            <View>
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
                    <View style={{ backgroundColor: COLORS.white }}>
                        <TouchableOpacity
                            style={styles.greenButton}
                            onPress={() =>
                                navigation.navigate('Screen', {
                                    screen: 'LeaveRequest',
                                })
                            }
                        >
                            <Text style={styles.greenButtonText}>
                                ЧӨЛӨӨНИЙ ХҮСЭЛТ ИЛГЭЭХ
                            </Text>
                        </TouchableOpacity>
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
            />
        </>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        height: 280,
        justifyContent: 'center',
        position: 'relative',
        marginTop: -30,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 160,
        height: 160,
        position: 'absolute',
        right: 20,
        top: 70,
        opacity: 0.1,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: COLORS.white,
        borderWidth: 2,
        marginRight: 16,
        backgroundColor: COLORS.white,
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
        fontSize: 14,
        marginTop: 4,
        color: COLORS.white,
    },
    detailButton: {
        marginTop: 8,
        backgroundColor: 'green',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    detailButtonText: {
        color: COLORS.white,
        fontSize: 12,
    },
    greenButton: {
        backgroundColor: 'green',
        padding: 14,
        borderRadius: 10,
        marginHorizontal: 16,
        marginVertical: 22,
    },
    greenButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
