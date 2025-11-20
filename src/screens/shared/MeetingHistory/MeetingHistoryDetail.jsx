import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { formatDateTime } from '@/functions';
import { ATTENDANCE_COLORS, ATTENDANCE_LABELS } from '@/lib/utils';
import { COLORS, shadow } from '@/constants/theme';

const MeetingHistoryDetail = () => {
    const route = useRoute();
    const { data } = route.params || {};

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{data?.title ?? 'Хурал'}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>🗓 Эхлэх:</Text>
                <Text style={styles.text}>
                    {formatDateTime(data?.start_date) ?? '-'}
                </Text>

                <Text style={styles.label}>🗓 Дуусах:</Text>
                <Text style={styles.text}>
                    {formatDateTime(data?.end_date) ?? '-'}
                </Text>

                <Text style={styles.label}>📌 Хамрах хүрээ:</Text>
                <Text style={styles.text}>
                    {data?.scope?.length
                        ? data.scope
                              .map(
                                  s =>
                                      `${s.position_name || ''} (${
                                          s.affiliation || ''
                                      })`,
                              )
                              .join(', ')
                        : 'Тодорхойгүй'}
                </Text>

                <Text style={styles.label}>Тайлбар:</Text>
                <Text style={styles.text}>
                    {data?.description?.replace(/<[^>]+>/g, '') ||
                        'Байхгүй байна...'}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>📂 Хэлэлцэх асуудлууд</Text>
                {data?.agendas?.length ? (
                    data.agendas.map(a => (
                        <Text key={a.id} style={styles.bullet}>
                            • {a.agenda}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.text}>Хэлэлцэх асуудал алга</Text>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>📊 Ирцийн хувь</Text>
                {data?.attendance_percentages ? (
                    Object.entries(data.attendance_percentages).map(
                        ([key, value]) => (
                            <View key={key} style={styles.attendanceRow}>
                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor:
                                                ATTENDANCE_COLORS[key] ||
                                                '#D1D5DB',
                                        },
                                    ]}
                                />
                                <Text style={styles.text}>
                                    {ATTENDANCE_LABELS[key] || `Бүлэг ${key}`}:
                                    {` ${Number(value).toFixed(2)}%`}
                                </Text>
                            </View>
                        ),
                    )
                ) : (
                    <Text style={styles.text}>Ирцийн мэдээлэл алга</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default MeetingHistoryDetail;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E3A59',
        marginBottom: 12,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        ...shadow,
    },
    label: {
        fontWeight: '600',
        color: '#374151',
        marginTop: 8,
        marginBottom: 4,
    },
    text: {
        color: '#4B5563',
        fontSize: 16,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 16,
        color: '#374151',
        marginLeft: 8,
        marginBottom: 4,
    },
    attendanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
});
