import Toast from 'react-native-toast-message';
import { useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    requestPermission,
    onMessage,
    getToken,
    AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { useApi } from './useApi';

export const useFcm = () => {
    const messaging = getMessaging(getApp());
    const { request } = useApi();

    const saveToken = useCallback(async (token) => {
        try {
            await request('save_user_device_token/', 'POST', { token });
            console.log('FCM token амжилттай хадгалагдлаа.');
        } catch (err) {
            console.error('Алдаа --- SAVE FCM TOKEN --- :', err);
        }
    }, [request]);

    const getFcmToken = useCallback(async () => {
        try {
            const token = await getToken(messaging);
            if (token) {
                console.log('FCM Token:', token);
                await saveToken(token);
            }
        } catch (err) {
            console.error('FCM Token авахад алдаа гарлаа:', err);
        }
    }, [messaging, saveToken]);

    const requestPermissionAndroid = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await getFcmToken();
            }
        } catch (err) {
            console.error('Android permission request error:', err);
        }
    }, [getFcmToken]);

    const requestPermissionIos = useCallback(async () => {
        try {
            const authStatus = await requestPermission(messaging);
            const enabled =
                authStatus === AuthorizationStatus.AUTHORIZED ||
                authStatus === AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                setTimeout(getFcmToken, 2000);
            }
        } catch (err) {
            console.error('iOS permission request error:', err);
        }
    }, [messaging, getFcmToken]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            requestPermissionAndroid();
        } else {
            requestPermissionIos();
        }

        const unsubscribe = onMessage(messaging, (remoteMessage) => {
            const title = remoteMessage.notification?.title || 'Мэдэгдэл';
            const body = remoteMessage.notification?.body || '';

            Toast.show({
                type: 'custom',
                text1: title,
                text2: body,
                position: 'top',
                visibilityTime: 4000,
                topOffset: 80,
            });
        });

        return () => unsubscribe();
    }, [messaging, requestPermissionAndroid, requestPermissionIos]);
};
