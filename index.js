/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

const messagingInstance = getMessaging(getApp());
setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
    try {
        if (__DEV__) {
            console.log('📩 Background FCM message:', remoteMessage);
        }
    } catch (error) {
        if (__DEV__) {
            console.error('Error handling background FCM message:', error);
        }
    }
});

AppRegistry.registerComponent(appName, () => App);
