import { SkeletonBox } from '../utils/SkeletonBox';
import { StyleSheet, View } from 'react-native';

export const AttendanceHomeSkeleton = () => {
    return (
        <View>
            <SkeletonBox style={styles.title} />
            <SkeletonBox style={styles.header} />

            <View style={styles.grid}>
                {Array.from({ length: 6 }).map((_, idx) => (
                    <SkeletonBox key={idx} style={styles.card} />
                ))}
            </View>

            <SkeletonBox style={styles.subtitle} />
            <SkeletonBox style={styles.circle} />
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    title: {
        height: 24,
        width: 150,
        borderRadius: 6,
        marginBottom: 16,
    },
    header: {
        height: 40,
        borderRadius: 8,
        marginBottom: 20,
    },
    card: {
        width: '48%',
        height: 80,
        borderRadius: 10,
        marginBottom: 14,
    },
    subtitle: {
        height: 20,
        width: 120,
        marginBottom: 16,
        borderRadius: 6,
    },
    circle: {
        height: 200,
        borderRadius: 100,
    },
});
