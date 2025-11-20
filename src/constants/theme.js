import { Dimensions } from 'react-native';

export const COLORS = {
    primary: '#2355C4',
    secondary: '#9E9E9E',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    grey: '#9E9E9E',
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF3B30',
    lightGray: '#E0E0E0',
    darkGray: '#616161',
    separatorLine: '#CCCCCC',
};

export const { width, height } = Dimensions.get('window');

export const shadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
};
