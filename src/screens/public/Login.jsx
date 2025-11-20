import {
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User } from 'lucide-react-native';
import { COLORS, width, height, shadow } from '../../constants/theme';

export default function Login() {
    const navigation = useNavigation();

    const handleLoginPress = async () => {
        navigation.push('UsernamePassword');
    };

    const handleDanPress = () => {
        navigation.push('danLogin');
    };

    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            resizeMode="cover"
            style={styles.container}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={styles.container}>
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.brandSection}>
                    <Text style={styles.appName}>
                        Нийслэлийн Иргэдийн Төлөөлөгчдийн Хурал
                    </Text>
                </View>

                <View style={styles.loginSection}>
                    <TouchableOpacity
                        style={styles.danButton}
                        onPress={() => handleDanPress()}
                        activeOpacity={0.8}
                    >
                        <View style={styles.danIconContainer}>
                            <Image
                                source={require('../../assets/images/dan.png')}
                                style={styles.imageSize}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.danButtonText}>
                            нэвтрэлтийн систем
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLoginPress}
                        activeOpacity={0.8}
                    >
                        <View style={styles.loginIconContainer}>
                            <User size={38} color={COLORS.primary} />
                        </View>
                        <Text style={styles.loginButtonText}>
                            нэвтрэх нэр нууц үг
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        ©2025 Улаанбаатар хотын захиргаа
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageSize: {
        width: 60,
        height: 60,
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: height * 0.12,
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 18,
        backgroundColor: 'rgba(74, 222, 128, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    tagline: {
        fontSize: 16,
        color: COLORS.grey,
        letterSpacing: 1,
        textTransform: 'lowercase',
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        marginTop: 120,
    },
    illustration: {
        width: width * 0.65,
        height: width * 0.65,
        maxHeight: 280,
    },
    loginSection: {
        width: '100%',
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    danButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 14,
        marginBottom: 20,
        width: '100%',
        maxWidth: 300,
        ...shadow,
    },
    danIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
    },
    danButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginLeft: 40,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 14,
        marginBottom: 80,
        width: '100%',
        maxWidth: 300,
        ...shadow,
    },
    loginIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginLeft: 20,
    },
    termsText: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.grey,
        maxWidth: 280,
    },
    BiometricIconContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
});
