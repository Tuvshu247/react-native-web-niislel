import { useEffect, useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useApi } from '@/hooks/useApi';
import { COLORS, shadow } from '@/constants/theme';
import RegularNews from './RegularNews';
import SpecialNews from './SpecialNews';
import { NewsCardSkeleton } from '@/components/loaders/skeletons/NewsCardSkeleton';

export default function NewsInfo() {
    const [selectedTab, setSelectedTab] = useState('regular');
    const [search, setSearch] = useState('');

    const { data, request, loading } = useApi();

    useEffect(() => {
        request('news/');
    }, [request]);

    const regularNews = Array.isArray(data)
        ? data.filter(item => item.is_special !== 'Онцгой')
        : [];

    const specialNews = Array.isArray(data)
        ? data.filter(item => item.is_special === 'Онцгой')
        : [];

    const renderSkeletons = () => (
        <View style={styles.skeletonWrapper}>
            {Array.from({ length: 5 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
            ))}
        </View>
    );

    const renderContent = () => {
        if (loading) return renderSkeletons();
        return selectedTab === 'regular' ? (
            <RegularNews search={search} data={regularNews} />
        ) : (
            <SpecialNews search={search} data={specialNews} />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TabButton
                    label="Мэдээ мэдээлэл"
                    active={selectedTab === 'regular'}
                    onPress={() => setSelectedTab('regular')}
                />
                <TabButton
                    label="Онцлох мэдээ"
                    active={selectedTab === 'special'}
                    onPress={() => setSelectedTab('special')}
                />
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

            <View style={styles.newsListWrapper}>{renderContent()}</View>
        </View>
    );
}

function TabButton({ label, active, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.tab, active && styles.activeTab]}
            onPress={onPress}
        >
            <Text style={[styles.tabText, active && styles.activeTabText]}>
                {label}
            </Text>
        </TouchableOpacity>
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
        ...shadow,
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
    newsListWrapper: {
        flex: 1,
    },
    skeletonWrapper: {
        paddingHorizontal: 18,
    },
});
