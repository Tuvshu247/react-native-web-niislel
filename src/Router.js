import { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '@/contexts/AuthContext';

import MemberLayout from './components/layouts/MemberLayout';
import LeaderLayout from './components/layouts/LeaderLayout';
import ScreenLayout from './components/layouts/ScreenLayout';
import WebViewLayout from './components/layouts/WebViewLayout';

import Login from './screens/public/Login';
import DanLogin from './screens/public/danLogin';
import UsernamePassword from './screens/public/UsernamePassword';
import Splash from './screens/public/Splash';
import ChangePasswordLayout from './components/layouts/ChangePasswordLayout';

import UserProfile from './screens/shared/UserProfile';
import DirectChat from './screens/shared/DirectChat';

const Stack = createNativeStackNavigator();

export default function Router() {
    const { userRole, initializing } = useContext(AuthContext);

    if (initializing) return <Splash />;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!userRole || (userRole !== '1' && userRole !== '2') ? (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="danLogin" component={DanLogin} />
                        <Stack.Screen name="UsernamePassword" component={UsernamePassword} />
                        <Stack.Screen name="ChangePasswordLayout" component={ChangePasswordLayout} />
                    </>
                ) : (
                    <>
                        {userRole === '1' && <Stack.Screen name="Leader" component={LeaderLayout} />}
                        {userRole === '2' && <Stack.Screen name="Member" component={MemberLayout} />}

                        <Stack.Screen name="Screen" component={ScreenLayout} />
                        <Stack.Screen name="WebView" component={WebViewLayout} />
                        <Stack.Screen name="UserProfile" component={UserProfile} />
                        <Stack.Screen name="DirectChat" component={DirectChat} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
