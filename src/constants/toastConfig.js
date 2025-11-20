import { View, Text, Image, StyleSheet } from 'react-native';

const toastConfig = {
    custom: ({ text1, text2 }) => (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.textWrapper}>
                {text1 && <Text style={styles.title}>{text1}</Text>}
                {text2 && (
                    <Text
                        style={styles.message}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {text2}
                    </Text>
                )}
            </View>
        </View>
    ),
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '92%',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    logo: {
        width: 28,
        height: 28,
        marginRight: 12,
    },
    textWrapper: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 2,
    },
    message: {
        fontSize: 14,
        color: '#555',
    },
});

export default toastConfig;
