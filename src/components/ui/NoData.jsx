import { Image, StyleSheet, Text, View } from 'react-native';

export default function NoData({ message = 'Мэдээлэл байхгүй байна' }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Image
                    source={require('@/assets/images/empty-box.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.text}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 16,
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});
