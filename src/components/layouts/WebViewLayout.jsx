import { useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomHeader from '../ui/CustomHeader';
import { COLORS } from '@/constants/theme';

export default function WebViewLayout({ route }) {
    const { url, title } = route.params;
    const webviewRef = useRef(null);
    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.container}>
            <CustomHeader title={title} />

            <View style={styles.webviewContainer}>
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color={COLORS.primary}
                        style={styles.loading}
                    />
                )}

                <WebView
                    ref={webviewRef}
                    source={{ uri: url }}
                    onLoadEnd={() => setLoading(false)}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    style={styles.webview}
                    incognito
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webviewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -18,
        marginTop: -18,
        zIndex: 1,
    },
});
