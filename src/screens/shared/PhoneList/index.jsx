import { NewsCardSkeleton } from '@/components/loaders/skeletons/NewsCardSkeleton';
import { COLORS, shadow } from '@/constants/theme';
import { useApi } from '@/hooks/useApi';
import { PHONE_LIST_TABS } from '@/lib/utils';
import { Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import MemberList from './MemberList';
import StaffList from './StaffList';

export default function PhoneList() {
    const [selectedTab, setSelectedTab] = useState('staff');
    const [search, setSearch] = useState('');

    const staffApi = useApi();
    const memberApi = useApi();

    useEffect(() => {
        staffApi.request('phone_list/');
        memberApi.request('member_phone_list/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isLoading =
        selectedTab === 'staff' ? staffApi.loading : memberApi.loading;

    const filteredData = useMemo(() => {
        const rawData =
            selectedTab === 'staff' ? staffApi.data : memberApi.data;
        if (!Array.isArray(rawData)) return [];

        return rawData.filter(item => {
            const lowerSearch = search.toLowerCase();

            if (selectedTab === 'staff') {
                return (
                    item.username?.toLowerCase().includes(lowerSearch) ||
                    item.phone?.toString().includes(lowerSearch) ||
                    item.email?.toLowerCase().includes(lowerSearch)
                );
            }

            const fullName = `${item.last_name} ${item.first_name}`;
            return (
                fullName?.toLowerCase().includes(lowerSearch) ||
                item.phone_number?.toString().includes(lowerSearch) ||
                item.email?.toLowerCase().includes(lowerSearch)
            );
        });
    }, [search, selectedTab, staffApi.data, memberApi.data]);

    const renderTabButton = (label, value) => (
        <TouchableOpacity
            key={value}
            style={[styles.tab, selectedTab === value && styles.activeTab]}
            onPress={() => setSelectedTab(value)}
        >
            <Text
                style={[
                    styles.tabText,
                    selectedTab === value && styles.activeTabText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <>
                    {[...Array(5)].map((_, i) => (
                        <NewsCardSkeleton key={i} />
                    ))}
                </>
            );
        }

        return selectedTab === 'staff' ? (
            <StaffList data={filteredData} />
        ) : (
            <MemberList data={filteredData} />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {PHONE_LIST_TABS.map(tab =>
                    renderTabButton(tab.label, tab.value),
                )}
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Хайх..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {renderContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: COLORS.white, flex: 1 },
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
