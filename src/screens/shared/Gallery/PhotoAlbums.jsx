import NoData from '@/components/ui/NoData';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { shadow } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';

export default function PhotoAlbums({ data }) {
    const navigation = useNavigation();
    if (!data || data.length === 0) return <NoData />;

    const handlePress = id => {
        navigation.navigate('AlbumImages', { album_id: id });
    };

    return (
        <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePress(item.id)}>
                    <View style={styles.albumCard}>
                        {item.first_image ? (
                            <Image
                                source={{ uri: item.first_image }}
                                style={styles.image}
                            />
                        ) : (
                            <View style={[styles.image, styles.placeholder]}>
                                <Text style={styles.placeholderText}>
                                    Зураг олдсонгүй...
                                </Text>
                            </View>
                        )}
                        <View style={styles.infoContainer}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.subtitle}>
                                {item.images_count} зураг | {item.total_size}
                            </Text>
                            {item.description && (
                                <Text style={styles.description}>
                                    {item.description}
                                </Text>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    albumCard: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        ...shadow,
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: '#eee',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        textAlign: 'center',
    },
    infoContainer: {
        marginLeft: 12,
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginVertical: 4,
    },
    subtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    },
    description: {
        fontSize: 10,
        color: '#333',
    },
});
