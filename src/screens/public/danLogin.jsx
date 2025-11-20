/* eslint-disable react-native/no-inline-styles */
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useRef } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    Linking,
    StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function DanLogin() {
    const navigation = useNavigation();
    const webviewRef = useRef(null);
    const { danLogin, error, loading } = useAuth();

    const handleNavigationStateChange = async event => {
        const url = event.url;

        if (/^(sms|tel|mailto):/.test(url)) {
            Linking.openURL(url).catch(console.error);
            return false;
        }

        if (url.startsWith('https://nith.ulaanbaatar.mn/dan/redirect')) {
            const codeMatch = url.match(/[?&]code=([^&]+)/);
            if (codeMatch?.[1]) {
                const code = codeMatch[1];
                const result = await danLogin(code);

                if (result === 'success') {
                    const userRole = await AsyncStorage.getItem('user_role');
                    console.log('User role:', userRole);
                }
            }
            return false;
        }

        return true;
    };

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <SafeAreaView edges={['top']} style={styles.safeTop}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <ArrowLeft
                            size={isTablet ? 26 : 22}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>ДАН НЭВТРЭЛТ</Text>

                    <View style={styles.backButton} />
                </View>
            </SafeAreaView>

            <View style={{ flex: 1 }}>
                <WebView
                    ref={webviewRef}
                    source={{
                        uri: 'https://sso.gov.mn/login?response_type=code&client_id=2b5110e9fe271254b5a2c242-eec59dae801cef227bbcc5f4504cc80d&redirect_uri=https://nith.ulaanbaatar.mn/dan/redirect&scope=W3sic2VydmljZXMiOlsiV1MxMDAxMDFfZ2V0Q2l0aXplbklEQ2FyZEluZm8iXSwid3NkbCI6Imh0dHBzOi8veHlwLmdvdi5tbi9jaXRpemVuLTEuMy4wL3dzP1dTREwifV0=&state=SHPNGv1yuDArQJIgvgsiRPNBPHZT4O3T',
                    }}
                    startInLoadingState
                    javaScriptEnabled
                    onNavigationStateChange={handleNavigationStateChange}
                    style={{ flex: 1 }}
                />

                {loading && (
                    <View style={styles.center}>
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                        />
                        <Text>Түр хүлээнэ үү...</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.center}>
                        <Text style={{ color: 'red', textAlign: 'center' }}>
                            {error}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeTop: {
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: COLORS.lightGray,
        zIndex: 999,
    },
    backButton: { width: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary,
        textAlign: 'center',
        flex: 1,
    },
    center: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});
