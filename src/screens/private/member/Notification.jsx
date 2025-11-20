/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { ScreenWrapperNotif } from '@/components/ui/ScreenWrapperNotif';
import { WebView } from 'react-native-webview';
import QuickAnnouncementSkeleton from '@/components/loaders/skeletons/QuickAnnouncementSkeleton';
import { useNotifUnseen } from '@/contexts/NotifUnseenContext';
import { useIsFocused } from '@react-navigation/native';

const Notification = () => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const opacity = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();

    const { refresh } = useNotifUnseen();

    useEffect(() => {
        if (!isFocused) return;

        const interval = setInterval(() => {
            refresh();
        }, 2000);

        return () => clearInterval(interval);
    }, [isFocused, refresh]);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('user_id');
            setUserId(id);
        };
        fetchUserId();
    }, []);

    const handleLoadEnd = () => {
        setLoading(false);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <ScreenWrapperNotif headerText="Мэдэгдэл">
            <View style={styles.container}>
                {loading && <QuickAnnouncementSkeleton />}
                {userId && (
                    <Animated.View style={{ flex: 1, opacity }}>
                        <WebView
                            source={{
                                uri: `https://nith.ulaanbaatar.mn/pwa/notif/?user_id=${userId}`,
                            }}
                            onLoadEnd={handleLoadEnd}
                            startInLoadingState
                            javaScriptEnabled
                            domStorageEnabled
                            style={styles.webview}
                            incognito
                        />
                    </Animated.View>
                )}
            </View>
        </ScreenWrapperNotif>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});
