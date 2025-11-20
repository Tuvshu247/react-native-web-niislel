import { NewsCardSkeleton } from '@/components/loaders/skeletons/NewsCardSkeleton';
import { useApi } from '@/hooks/useApi';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS, shadow } from '@/constants/theme';
import ResolvedRequests from './ResolvedRequests';
import UnresolvedRequests from './UnresolvedRequests';
import { useFocusEffect } from '@react-navigation/native';

export default function ApproveLeaveRequest() {
    const [selectedTab, setSelectedTab] = useState('unresolved');
    const { data, request, loading } = useApi();

    // 🔄 Refresh data every time screen comes into focus
    useFocusEffect(
        useCallback(() => {
            request('leave_request/');
        }, [request]),
    );

    const unresolvedRequests =
        data?.filter(item => item.status === 'Хүлээгдэж байна') || [];

    const resolvedRequests =
        data?.filter(item => item.status !== 'Хүлээгдэж байна') || [];

    const renderSkeletons = () => (
        <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
        </>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'unresolved' && styles.activeTab,
                    ]}
                    onPress={() => setSelectedTab('unresolved')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === 'unresolved' &&
                                styles.activeTabText,
                        ]}
                    >
                        Шийдвэрлэгдээгүй
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'resolved' && styles.activeTab,
                    ]}
                    onPress={() => setSelectedTab('resolved')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === 'resolved' && styles.activeTabText,
                        ]}
                    >
                        Шийдвэрлэгдсэн
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                {loading ? (
                    renderSkeletons()
                ) : selectedTab === 'unresolved' ? (
                    <UnresolvedRequests data={unresolvedRequests} />
                ) : (
                    <ResolvedRequests data={resolvedRequests} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        margin: 16,
        overflow: 'hidden',
        ...shadow,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        ...shadow,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        color: '#888',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
});
