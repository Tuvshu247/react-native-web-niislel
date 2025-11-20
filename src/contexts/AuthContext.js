import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [initializing, setInitializing] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const role = await AsyncStorage.getItem('user_role');

                if (token) {
                    const decoded = jwtDecode(token);
                    const now = Math.floor(Date.now() / 1000);

                    if (decoded.exp > now) {
                        setUserRole(role);
                    } else {
                        await AsyncStorage.clear();
                    }
                }
            } catch (err) {
                console.warn('Auth check failed:', err);
                await AsyncStorage.clear();
            } finally {
                setInitializing(false);
            }
        };

        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userRole, setUserRole, initializing }}>
            {children}
        </AuthContext.Provider>
    );
};
