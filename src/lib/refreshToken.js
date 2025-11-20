import { BASE_URL } from '../constants/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const refreshToken = async () => {
    const storedRefreshToken = await AsyncStorage.getItem('refresh_token');

    if (!storedRefreshToken) return null;

    try {
        const response = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: storedRefreshToken,
        });

        const { access } = response.data;
        await AsyncStorage.setItem('access_token', access);
        return access;
    } catch (err) {
        console.error(err);
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        return null;
    }
};
