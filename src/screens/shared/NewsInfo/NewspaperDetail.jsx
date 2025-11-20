import { IMAGE_URL } from '@/constants/urls';
import { formatDateTime } from '@/functions';
import { shadow } from '@/constants/theme';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    InteractionManager,
} from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';

export default function NewspaperDetail() {
    const route = useRoute();
    const { title, image, text, source_name, journalist, created_at } =
        route.params || {};

    const [imageError, setImageError] = useState(false);
    const [renderReady, setRenderReady] = useState(false);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setRenderReady(true);
        });
        return () => task.cancel();
    }, []);

    const contentText = Array.isArray(text) ? text.join('\n\n') : text;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>

                {image && !imageError ? (
                    <Image
                        source={{ uri: `${IMAGE_URL}${image}` }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View style={styles.iconPlaceholder}>
                        <ImageIcon color="#ccc" size={64} />
                    </View>
                )}

                <Text style={styles.meta}>📰 {source_name}</Text>
                <Text style={styles.meta}>✍️ {journalist}</Text>
                <Text style={styles.meta}>🕒 {formatDateTime(created_at)}</Text>

                {renderReady && contentText && (
                    <View style={styles.content}>
                        <Text style={styles.textContent}>{contentText}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        ...shadow,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 18,
    },
    iconPlaceholder: {
        height: 200,
        borderRadius: 10,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },
    meta: {
        fontSize: 13,
        color: '#777',
        marginBottom: 4,
    },
    content: {
        marginTop: 10,
    },
    textContent: {
        fontSize: 16,
        color: '#1a1a1a',
        lineHeight: 22,
    },
});
