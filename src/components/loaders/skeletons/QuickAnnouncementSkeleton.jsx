import { StyleSheet, View } from 'react-native';
import { SkeletonBox } from '../utils/SkeletonBox';

export default function QuickAnnouncementSkeleton() {
    return (
        <View style={styles.container}>
            {[...Array(5)].map((_, i) => (
                <View key={i} style={styles.card}>
                    <View style={styles.headerRow}>
                        <SkeletonBox style={styles.icon} />
                        <SkeletonBox style={styles.headerText} />
                    </View>
                    <SkeletonBox style={styles.message} />
                    <SkeletonBox style={styles.subMessage} />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
    },
    card: {
        marginBottom: 24,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingHorizontal: 18,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    headerText: {
        height: 14,
        width: '60%',
        borderRadius: 4,
    },
    message: {
        height: 10,
        width: '90%',
        borderRadius: 4,
        marginTop: 6,
    },
    subMessage: {
        height: 10,
        width: '80%',
        borderRadius: 4,
        marginTop: 6,
    },
});
