import { Overlay } from '@/components/ui/Overlay';
import { useApi } from '@/hooks/useApi';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    StatusBar,
    StyleSheet,
    Text,
    Vibration,
    View,
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { height } from '@/constants/theme';

export default function QRScreen() {
    const { request: postRequest, data: responseData } = useApi();
    const [scanned, setScanned] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const isFocused = useIsFocused();
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isFocused) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        }
    }, [animation, isFocused]);

    const resetScan = useCallback(() => {
        setTimeout(() => {
            setScanned(false);
            setFeedback(null);
        }, 3000);
    }, []);

    const handleBarCodeScanned = useCallback(
        async event => {
            if (scanned) return;

            const data = event.nativeEvent.codeStringValue;
            setScanned(true);
            Vibration.vibrate();

            const match = data.match(/meeting[_ ]id\s*:\s*(\d+)/i);
            const meetingId = match?.[1];

            if (!meetingId) {
                setFeedback('QR формат буруу байна');
                resetScan();
                return;
            }

            try {
                await postRequest('register_attendance_using_qr/', 'POST', {
                    meeting_id: meetingId,
                });
                if (responseData?.message) {
                    setFeedback(responseData.message);
                } else {
                    setFeedback('Амжилттай бүртгэгдлээ');
                }
            } catch {
                setFeedback('Алдаа гарлаа. Дахин оролдоно уу.');
            }

            resetScan();
        },
        [scanned, postRequest, resetScan, responseData],
    );

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 280],
    });

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
                animated
            />
            {isFocused && (
                <>
                    <Camera
                        style={StyleSheet.absoluteFill}
                        scanBarcode={true}
                        onReadCode={handleBarCodeScanned}
                        showFrame={false}
                        hideControls={true}
                        cameraType="back"
                    />
                    <Overlay />
                    <View style={styles.titleWrapper}>
                        <Text style={styles.titleText}>
                            Хурлын ирц бүртгүүлэх
                        </Text>
                    </View>
                    <Animated.View
                        style={[
                            styles.scanLine,
                            {
                                transform: [{ translateY }],
                                top: height / 2 - 140,
                            },
                        ]}
                    />
                </>
            )}
            {feedback && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>{feedback}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    text: {
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#0E7AFE',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    permissionText: {
        color: 'white',
        fontSize: 16,
    },
    scanLine: {
        position: 'absolute',
        width: 240,
        height: 3,
        backgroundColor: '#00FF00',
        borderRadius: 2,
        alignSelf: 'center',
    },
    result: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#222',
        borderRadius: 20,
        padding: 14,
        alignItems: 'center',
    },
    resultText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    titleWrapper: {
        position: 'absolute',
        top: 60,
        width: '100%',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
        letterSpacing: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
});
