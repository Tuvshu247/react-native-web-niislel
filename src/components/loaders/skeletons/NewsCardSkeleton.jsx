import { SkeletonBox } from '../utils/SkeletonBox';
import { shadow } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export const NewsCardSkeleton = () => {
    return (
        <View style={styles.card}>
            <SkeletonBox style={styles.image} />

            <View style={styles.content}>
                <SkeletonBox style={styles.title} />
                <SkeletonBox style={styles.meta} />
                <SkeletonBox style={styles.date} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 16,
        overflow: 'hidden',
        ...shadow,
    },
    image: {
        width: 100,
        height: 120,
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },
    content: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        justifyContent: 'center',
    },
    title: {
        width: '70%',
        height: 16,
        borderRadius: 6,
        marginBottom: 10,
    },
    meta: {
        width: '60%',
        height: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    date: {
        width: '30%',
        height: 10,
        borderRadius: 6,
    },
});
