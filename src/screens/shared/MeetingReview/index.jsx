import { useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import QuickAnnouncementSkeleton from '@/components/loaders/skeletons/QuickAnnouncementSkeleton';

export default function MeetingReview() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoadEnd = useCallback(() => {
        setLoading(false);
    }, []);

    const handleError = useCallback(() => {
        setError(true);
        setLoading(false);
    }, []);

    return (
        <View style={styles.container}>
            {loading && !error && (
                <View style={styles.loaderWrapper}>
                    <QuickAnnouncementSkeleton />
                </View>
            )}

            {error ? (
                <View style={styles.errorWrapper}>
                    <Text style={styles.errorText}>
                        Уучлаарай, хуудсыг ачаалж чадсангүй.
                    </Text>
                </View>
            ) : (
                <WebView
                    source={{
                        uri: 'https://nith.ulaanbaatar.mn/pwa/meeting-review',
                    }}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                    startInLoadingState
                    javaScriptEnabled
                    domStorageEnabled
                    style={styles.webview}
                    incognito
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loaderWrapper: {
        zIndex: 1,
        backgroundColor: '#fff',
    },
    errorWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 16,
        textAlign: 'center',
    },
    webview: {
        flex: 1,
    },
});
