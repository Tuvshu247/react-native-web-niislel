/* eslint-disable react-native/no-inline-styles */
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { width } from '@/constants/theme';
import LinearGradient from 'react-native-linear-gradient';

export const Shimmer = ({
    colors = ['#e0e0e0', '#f5f5f5', '#e0e0e0'],
    duration = 1500,
}) => {
    const shimmerValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerValue, {
                toValue: 1,
                duration,
                useNativeDriver: true,
            }),
        ).start();
    }, [duration, shimmerValue]);

    const translateX = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <Animated.View
            style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ flex: 1 }}
            />
        </Animated.View>
    );
};
