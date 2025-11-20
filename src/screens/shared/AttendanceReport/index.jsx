import MemberReportSkeleton from '@/components/loaders/skeletons/MemberReportSkeleton';
import { getUserInfo } from '@/functions';
import { useApi } from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import MeetingReport from './MeetingReport';
import MemberReport from './MemberReport';
import { shadow, COLORS } from '@/constants/theme';

export default function AttendanceReport() {
    const {
        data: memberData,
        request: memberRequest,
        loading: memberLoading,
    } = useApi();
    const {
        data: meetingData,
        request: meetingRequest,
        loading: meetingLoading,
    } = useApi();

    const [selectedTab, setSelectedTab] = useState('member');

    const tabs = [
        { key: 'member', label: 'Миний ирц' },
        { key: 'meeting', label: 'Хурлын ирц' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const user = await getUserInfo();
            if (user?.memberId) {
                memberRequest(`meeting_attendance/${user.memberId}/`);
            }
            meetingRequest('meeting_attendance/');
        };

        fetchData();
    }, [memberRequest, meetingRequest]);

    const renderTabs = () =>
        tabs.map(tab => {
            const active = selectedTab === tab.key;
            return (
                <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, active && styles.activeTab]}
                    onPress={() => setSelectedTab(tab.key)}
                >
                    <Text
                        style={[styles.tabText, active && styles.activeTabText]}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            );
        });

    const renderContent = () => {
        if (selectedTab === 'member') {
            return memberLoading ? (
                <MemberReportSkeleton />
            ) : (
                <MemberReport data={memberData} />
            );
        } else {
            return meetingLoading ? (
                <MemberReportSkeleton />
            ) : (
                <MeetingReport data={meetingData} />
            );
        }
    };

    return (
        <View style={styles.flex}>
            <View style={styles.tabContainer}>{renderTabs()}</View>
            {renderContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.white },
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
    activeTab: { backgroundColor: COLORS.primary },
    tabText: { color: '#888', fontWeight: '600' },
    activeTabText: { color: '#fff' },
});
