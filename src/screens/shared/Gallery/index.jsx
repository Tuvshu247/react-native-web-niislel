import PhotosSkeleton from '@/components/loaders/skeletons/PhotosSkeleton';
import { getUserInfo } from '@/functions';
import { useApi } from '@/hooks/useApi';
import { useWebApi } from '@/hooks/useWebApi';
import { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS, shadow } from '@/constants/theme';
import OwnPhotos from './OwnPhotos';
import PhotoAlbums from './PhotoAlbums';

export default function Gallery() {
    const {
        data: ownPhotosData,
        request: ownPhotosRequest,
        loading: ownPhotosLoading,
    } = useApi();

    const {
        data: photoAlbumData,
        request: photoAlbumRequest,
        loading: photoAlbumLoading,
    } = useWebApi();

    const [selectedTab, setSelectedTab] = useState('ownPhotos');

    const getOwnPhotosData = useCallback(async () => {
        const user = await getUserInfo();
        if (user?.memberId) {
            ownPhotosRequest(`gallery_image/${user.memberId}/`);
        }
    }, [ownPhotosRequest]);

    useEffect(() => {
        getOwnPhotosData();
        photoAlbumRequest('albums/');
    }, [getOwnPhotosData, photoAlbumRequest]);

    const tabs = [
        { key: 'ownPhotos', label: 'Өөрийн зургууд' },
        { key: 'photoAlbums', label: 'Зургийн цомог' },
    ];

    const renderTabs = () =>
        tabs.map(tab => (
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
        ));

    const renderContent = () => {
        if (ownPhotosLoading || photoAlbumLoading) return <PhotosSkeleton />;
        return selectedTab === 'ownPhotos' ? (
            <OwnPhotos data={ownPhotosData} />
        ) : (
            <PhotoAlbums data={photoAlbumData} />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>{renderTabs()}</View>
            {renderContent()}
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
