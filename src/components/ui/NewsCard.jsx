import { COLORS, shadow } from '@/constants/theme';
import { IMAGE_URL } from '@/constants/urls';
import { formatDate } from '@/functions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image as ImageIcon, Globe, Newspaper } from 'lucide-react-native';

dayjs.extend(relativeTime);

export default function NewsCard({ item }) {
    const [imageError, setImageError] = useState(false);
    const navigation = useNavigation();

    const imageUrl = `${IMAGE_URL}${item.image_url}`;
    const displayDate = formatDate(item.created_at);

    const isExternal = item.url?.startsWith('http');

    const handlePress = () => {
        if (isExternal) {
            navigation.navigate('WebView', {
                url: item.url,
                title: item.source.name,
            });
        } else {
            navigation.navigate('NewspaperDetail', {
                title: item.title,
                image: item.image_url,
                text: item.text,
                source_name: item.source_name,
                journalist: item.journalist,
                created_at: item.created_at,
            });
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            {imageError || !item.image_url ? (
                <View style={styles.iconContainer}>
                    <ImageIcon size={40} color="#aaa" />
                </View>
            ) : (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    onError={() => setImageError(true)}
                />
            )}

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.meta}>
                    📰 {item.source_name} • {item.journalist}
                </Text>
                <Text style={styles.date}>{displayDate}</Text>

                <View style={styles.cornerIcon}>
                    {isExternal ? (
                        <Globe size={20} color="orange" />
                    ) : (
                        <Newspaper size={20} color={COLORS.primary} />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cornerIcon: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        padding: 4,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 16,
        overflow: 'hidden',
        ...shadow,
    },
    image: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },
    iconContainer: {
        width: 100,
        height: 116,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },
    content: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    meta: {
        fontSize: 13,
        color: '#555',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: 'green',
    },
});
