/* eslint-disable react-hooks/exhaustive-deps */
import { COLORS, shadow } from '@/constants/theme';
import { getUserInfo } from '@/functions';
import { useApi } from '@/hooks/useApi';
import { ATTENDANCE_COLORS, ATTENDANCE_LABELS } from '@/lib/utils';
import { useEffect } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { AttendanceHomeSkeleton } from '../loaders/skeletons/AttendanceHomeSkeleton';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function AttendanceHomeBlock() {
    const navigation = useNavigation();
    const { data, request, loading } = useApi();

    const getData = async () => {
        const user = await getUserInfo();
        if (user?.memberId) {
            request(`meeting_attendance/${user?.memberId}/`);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const summary = data
        ? {
              total_meetings: data.length,
              total_percentage: data.length
                  ? Math.round(
                        (data.filter(item => item.status === 'Ирсэн').length /
                            data.length) *
                            100,
                    )
                  : 0,
              status_data: Object.keys(ATTENDANCE_LABELS).map(status => ({
                  status,
                  count: data.filter(item => item.status === status).length,
              })),
          }
        : null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>ИРЦИЙН МЭДЭЭЛЭЛ</Text>

            <View style={{ backgroundColor: COLORS.white }}>
                <TouchableOpacity
                    style={styles.greenButton}
                    onPress={() =>
                        navigation.navigate('Screen', {
                            screen: 'AttendanceReport',
                        })
                    }
                >
                    <Text style={styles.greenButtonText}>
                        ХУРЛЫН ИРЦИЙН ДЭЛГЭРЭНГҮЙ
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <AttendanceHomeSkeleton />
            ) : summary ? (
                <View style={styles.summaryBox}>
                    <Text style={styles.percentage}>
                        Нийт ирц: {summary.total_percentage}%
                    </Text>
                    <Text style={styles.total}>
                        Нийт хурал: {summary.total_meetings}
                    </Text>

                    <View style={styles.statusGrid}>
                        {summary.status_data?.map((item, idx) => {
                            const label = ATTENDANCE_LABELS[item.status];
                            const color = ATTENDANCE_COLORS[item.status];

                            return (
                                <View
                                    key={idx}
                                    style={[
                                        styles.statusItem,
                                        {
                                            backgroundColor: color + '33',
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: color },
                                        ]}
                                    />
                                    <Text style={styles.statusText}>
                                        {label}
                                    </Text>
                                    <Text style={styles.countText}>
                                        {item.count} удаа
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            ) : (
                <Text style={styles.noData}>Мэдээлэл олдсонгүй.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: isTablet ? 100 : 20,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: isTablet ? 24 : 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: isTablet ? 24 : 12,
    },
    summaryBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        padding: isTablet ? 28 : 20,
        marginBottom: isTablet ? 32 : 24,
        ...shadow,
    },
    percentage: {
        fontSize: isTablet ? 28 : 22,
        fontWeight: '600',
        color: '#2e7d32',
        marginBottom: 10,
    },
    total: {
        fontSize: isTablet ? 18 : 14,
        color: '#777',
        marginBottom: isTablet ? 24 : 20,
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: isTablet ? 16 : 12,
    },
    statusItem: {
        width: isTablet ? '30%' : '48%',
        borderRadius: 14,
        padding: isTablet ? 18 : 14,
    },
    colorDot: {
        width: isTablet ? 16 : 12,
        height: isTablet ? 16 : 12,
        borderRadius: isTablet ? 8 : 6,
        marginBottom: isTablet ? 8 : 6,
    },
    statusText: {
        fontSize: isTablet ? 17 : 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: isTablet ? 4 : 2,
    },
    countText: {
        fontSize: isTablet ? 15 : 13,
        color: '#666',
    },
    greenButton: {
        backgroundColor: 'green',
        padding: isTablet ? 18 : 14,
        borderRadius: isTablet ? 12 : 10,
        marginVertical: isTablet ? 28 : 22,
    },
    greenButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: isTablet ? 16 : 14,
        textAlign: 'center',
    },
    noData: {
        textAlign: 'center',
        marginTop: isTablet ? 24 : 20,
        fontSize: isTablet ? 16 : 14,
    },
});
