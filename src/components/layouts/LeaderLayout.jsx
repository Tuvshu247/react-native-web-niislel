/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationMode } from 'react-native-navigation-mode';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { COLORS, shadow } from '@/constants/theme';
import {
    Home as HomeIcon,
    MessageCircle,
    QrCode,
    Bell,
    Menu as MenuIcon,
} from 'lucide-react-native';
import { useUnread } from '@/contexts/UnreadContext';
import { useNotifUnseen } from '@/contexts/NotifUnseenContext';

import Home from '@/screens/private/leader/Home';
import Chat from '@/screens/private/leader/Chat';
import Qr from '@/screens/private/leader/Qr';
import Notification from '@/screens/private/leader/Notification';
import Menu from '@/screens/private/leader/Menu';

const Tab = createBottomTabNavigator();

export default function LeaderLayout() {
    const { unreadCount } = useUnread();
    const { unseenCount } = useNotifUnseen();
    const { navigationMode, loading } = useNavigationMode();

    if (loading) return null;

    const isGestureNav = navigationMode?.isGestureNavigation ?? false;
    const navHeight = navigationMode?.navigationBarHeight || 0;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height:
                            Platform.OS === 'android'
                                ? isGestureNav
                                    ? 50 + navHeight
                                    : 80
                                : 84,
                    },
                ],
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconWrapper}>
                            <HomeIcon
                                size={30}
                                color={focused ? COLORS.primary : '#999'}
                            />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Chat"
                component={Chat}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconWrapper}>
                            <MessageCircle
                                size={30}
                                color={focused ? COLORS.primary : '#999'}
                            />
                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Qr"
                component={Qr}
                options={{
                    tabBarIcon: () => (
                        <View style={styles.iconWrapper}>
                            <View style={styles.qrWrapper}>
                                <QrCode size={32} color={'white'} />
                            </View>
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconWrapper}>
                            <Bell
                                size={30}
                                color={focused ? COLORS.primary : '#999'}
                            />
                            {unseenCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {unseenCount > 9 ? '9+' : unseenCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconWrapper}>
                            <MenuIcon
                                size={30}
                                color={focused ? COLORS.primary : '#999'}
                            />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingTop: 20,
        zIndex: 10,
        ...shadow,
    },
    qrWrapper: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadow,
    },
    iconWrapper: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 10,
        backgroundColor: 'red',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
        lineHeight: 15,
    },
});
