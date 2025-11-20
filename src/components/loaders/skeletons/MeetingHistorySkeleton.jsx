/* eslint-disable react/no-unstable-nested-components */
import { FlatList, StyleSheet, View } from 'react-native';
import { shadow } from '@/constants/theme';
import { SkeletonBox } from '../utils/SkeletonBox';

export const MeetingHistorySkeleton = () => {
    const SkeletonCard = () => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <SkeletonBox style={styles.icon} />

                <View style={styles.texts}>
                    <SkeletonBox style={styles.title} />
                    <SkeletonBox style={styles.scope} />
                    <SkeletonBox style={styles.dateRow} />
                    <SkeletonBox style={styles.dateRow} />
                </View>

                <SkeletonBox style={styles.arrowIcon} />
            </View>
            <SkeletonBox style={styles.bottomRow} />
            <SkeletonBox style={styles.bottomRow} />
        </View>
    );

    return (
        <FlatList
            data={Array(4).fill(null)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={() => <SkeletonCard />}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        ...shadow,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 10,
    },
    texts: {
        flex: 1,
    },
    title: {
        height: 16,
        width: '80%',
        borderRadius: 6,
        marginBottom: 6,
    },
    scope: {
        height: 14,
        width: '60%',
        borderRadius: 6,
        marginBottom: 14,
    },
    dateRow: {
        height: 10,
        width: '40%',
        borderRadius: 6,
        marginBottom: 6,
    },
    bottomRow: {
        height: 10,
        width: '70%',
        borderRadius: 6,
        marginTop: 6,
    },
    arrowIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginLeft: 12,
    },
});
