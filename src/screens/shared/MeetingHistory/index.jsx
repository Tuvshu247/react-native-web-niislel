import { useEffect, useMemo, useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { MeetingHistorySkeleton } from '@/components/loaders/skeletons/MeetingHistorySkeleton';
import { shadow, COLORS } from '@/constants/theme';
import { useApi } from '@/hooks/useApi';
import FutureMeetings from './FutureMeetings';
import PastMeetings from './PastMeetings';

export default function MeetingHistory() {
    const [selectedTab, setSelectedTab] = useState('future');
    const [search, setSearch] = useState('');
    const { data, request, loading } = useApi();

    useEffect(() => {
        request('meeting_attendance/');
    }, [request]);

    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) return [];

        const now = new Date();

        return data
            .filter(item => {
                const startDate = new Date(item.start_date.replace(' ', 'T'));
                const inFuture = startDate > now;

                const searchQuery = search.toLowerCase();
                const matchesSearch =
                    item.title.toLowerCase().includes(searchQuery) ||
                    item.scope_names.toLowerCase().includes(searchQuery);

                return selectedTab === 'future'
                    ? inFuture && matchesSearch
                    : !inFuture && matchesSearch;
            })
            .sort(
                (a, b) =>
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime(),
            );
    }, [data, search, selectedTab]);

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {[
                    { key: 'future', label: 'Болох хуралдаан' },
                    { key: 'past', label: 'Өнгөрсөн хуралдаан' },
                ].map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tab,
                            selectedTab === tab.key && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab(tab.key)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab.key && styles.activeTabText,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Хайх..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {loading ? (
                <MeetingHistorySkeleton />
            ) : selectedTab === 'future' ? (
                <FutureMeetings data={filteredData} />
            ) : (
                <PastMeetings data={filteredData} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        marginHorizontal: 16,
        paddingHorizontal: 10,
        marginBottom: 18,
        ...shadow,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        fontSize: 16,
        color: '#000',
    },
});
