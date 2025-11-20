import { COLORS, width, shadow } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, LogIn } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function UsernamePassword() {
    const navigation = useNavigation();
    const { login, error, loading } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await login(username, password);
    };

    return (
        <ImageBackground
            source={require('@/assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <View style={styles.illustrationContainer}>
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={styles.illustration}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.loginSection}>
                            <TextInput
                                style={styles.input}
                                placeholder="Нэвтрэх нэр"
                                placeholderTextColor="#aaa"
                                value={username}
                                onChangeText={setUsername}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Нууц үг"
                                placeholderTextColor="#aaa"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            {error && <Text style={styles.error}>{error}</Text>}

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        'ChangePasswordLayout',
                                        {
                                            url: 'https://nith.ulaanbaatar.mn/pwa/change-password',
                                            title: 'Нууц үг сэргээх',
                                        },
                                    )
                                }
                                style={styles.forgotPasswordContainer}
                            >
                                <Text style={styles.forgotPasswordText}>
                                    Нууц үг мартсан?
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.loginButton,
                                        styles.backButton,
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.goBack()}
                                >
                                    <ArrowLeft
                                        size={isTablet ? 24 : 22}
                                        color={COLORS.black}
                                        style={styles.icon}
                                    />
                                    <Text style={styles.backButtonText}>
                                        Буцах
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.loginButton}
                                    activeOpacity={0.8}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator
                                            color={COLORS.white}
                                            size={isTablet ? 'large' : 'small'}
                                        />
                                    ) : (
                                        <>
                                            <LogIn
                                                size={isTablet ? 24 : 22}
                                                color={COLORS.white}
                                                style={styles.icon}
                                            />
                                            <Text
                                                style={styles.loginButtonText}
                                            >
                                                Нэвтрэх
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: isTablet ? 60 : 20,
        paddingVertical: 40,
    },
    content: {
        width: '100%',
        maxWidth: isTablet ? 500 : '100%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    illustration: {
        width: isTablet ? Math.min(screenWidth * 0.35, 280) : width * 0.55,
        height: isTablet ? Math.min(screenWidth * 0.35, 280) : width * 0.55,
        maxHeight: 220,
    },
    loginSection: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 12,
        ...shadow,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 14,
        width: '42%',
        ...shadow,
    },
    icon: {
        marginRight: 14,
    },
    loginButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.white,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20,
        gap: 20,
    },
    backButton: {
        backgroundColor: '#f3f4f6',
    },
    backButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.black,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginRight: '5%',
        marginBottom: 20,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontSize: 14,
        textAlign: 'center',
        width: '100%',
    },
});
