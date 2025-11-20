/* eslint-disable react-native/no-inline-styles */
import { Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { UnreadProvider } from '@/contexts/UnreadContext';
import { NotifUnseenProvider } from './contexts/NotifUnseenContext';
import toastConfig from './constants/toastConfig';
import Toast from 'react-native-toast-message';
import Router from './Router';

export default function App() {
    const isIOS = Platform.OS === 'ios';

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <WebSocketProvider>
                    <UnreadProvider>
                        <NotifUnseenProvider>
                            {isIOS ? (
                                <Router />
                            ) : (
                                <SafeAreaView
                                    style={{ flex: 1, backgroundColor: '#fff' }}
                                    edges={['bottom', 'left', 'right']}
                                >
                                    <Router />
                                </SafeAreaView>
                            )}
                        </NotifUnseenProvider>
                    </UnreadProvider>
                </WebSocketProvider>
            </AuthProvider>

            <Toast config={toastConfig} />
        </SafeAreaProvider>
    );
}
