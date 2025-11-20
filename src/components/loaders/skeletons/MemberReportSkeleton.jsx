import { View, StyleSheet } from 'react-native';
import { SkeletonBox } from '../utils/SkeletonBox';
import { shadow } from '@/constants/theme';

export default function MemberReportSkeleton() {
    const fakeData = Array.from({ length: 6 });

    const renderRow = (_, index) => (
        <View key={index} style={styles.row}>
            <View style={styles.cellLarge}>
                <SkeletonBox style={styles.line1} />
            </View>
            <View style={styles.cellMedium}>
                <SkeletonBox style={styles.singleLine} />
            </View>
            <View style={styles.cellSmall}>
                <SkeletonBox style={styles.smallLine} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <SkeletonBox style={styles.button} />
            </View>

            <View style={styles.header}>
                <View style={styles.cellLarge}>
                    <SkeletonBox style={styles.headerLine} />
                </View>
                <View style={styles.cellMedium}>
                    <SkeletonBox style={styles.headerLine} />
                </View>
                <View style={styles.cellSmall}>
                    <SkeletonBox style={styles.headerLine} />
                </View>
            </View>

            {fakeData.map(renderRow)}
        </View>
    );
}

const styles = StyleSheet.create({
    line1: {
        height: 20,
        borderRadius: 4,
        width: '90%',
    },
    singleLine: {
        height: 20,
        borderRadius: 4,
        width: '80%',
    },
    smallLine: {
        height: 20,
        borderRadius: 4,
        width: '60%',
    },
    headerLine: {
        height: 28,
        borderRadius: 4,
        width: '70%',
    },
    button: {
        height: 40,
        borderRadius: 10,
        width: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listContainer: {
        paddingBottom: 24,
    },
    filterContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateButton: {
        width: '100%',
        backgroundColor: '#2355C4',
        paddingHorizontal: 17,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: 'center',
        ...shadow,
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        alignSelf: 'center',
    },
    clearDateButton: {
        alignSelf: 'center',
        marginTop: 8,
    },
    clearDateText: {
        color: '#EF4444',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    row: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    cellLarge: {
        flex: 2,
        paddingVertical: 10,
        paddingHorizontal: 8,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#E5E7EB',
    },
    cellMedium: {
        flex: 1.5,
        paddingVertical: 10,
        paddingHorizontal: 8,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#E5E7EB',
    },
    cellSmall: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: '#111827',
    },
    headerText: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 14,
        color: '#1F2937',
    },
    statusText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    empty: {
        paddingVertical: 20,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
});
