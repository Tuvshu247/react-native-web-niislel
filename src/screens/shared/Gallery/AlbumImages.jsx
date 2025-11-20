/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import PhotosSkeleton from '@/components/loaders/skeletons/PhotosSkeleton';
import {
    Animated,
    Easing,
    FlatList,
    Image,
    Modal,
    PermissionsAndroid,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import NoData from '@/components/ui/NoData';
import { COLORS, width, shadow } from '@/constants/theme';
import { useWebApi } from '@/hooks/useWebApi';
import { useRoute } from '@react-navigation/native';
import { X, Download } from 'lucide-react-native';

const NUM_COLUMNS = 3;
const IMAGE_MARGIN = 8;
const ITEM_SIZE = width / NUM_COLUMNS - IMAGE_MARGIN * 2;

export default function AlbumImages() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalToast, setModalToast] = useState(null);

    const route = useRoute();
    const { album_id } = route.params || {};

    const { data, request, loading } = useWebApi();

    useEffect(() => {
        if (!album_id) return;
        request(`gallery-images/?album=${album_id}`);
    }, [request, album_id]);

    // fixed ref
    const flatListRef = useRef(null);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const toastTimer = useRef(null);

    const selectedImage = data?.[selectedIndex]?.image
        ? `${data[selectedIndex].image}`
        : null;

    const showModalToast = useCallback(message => {
        setModalToast(message);
        Animated.timing(toastOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => {
            Animated.timing(toastOpacity, {
                toValue: 0,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start(() => setModalToast(null));
        }, 2000);
    }, []);

    useEffect(
        () => () => toastTimer.current && clearTimeout(toastTimer.current),
        [],
    );

    const handleImagePress = useCallback(index => {
        setSelectedIndex(index);
        setModalVisible(true);
    }, []);

    const requestStoragePermission = async () => {
        if (Platform.OS !== 'android') return true;

        if (Platform.Version >= 33) {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
    };

    const handleDownload = useCallback(async () => {
        if (!selectedImage) return;

        const hasPermission = await requestStoragePermission();
        if (!hasPermission)
            return showModalToast('Зураг хадгалах эрх олгоно уу!');

        const filename =
            selectedImage.split('/').pop() || `image_${Date.now()}.jpg`;
        const downloadPath = Platform.select({
            ios: `${RNFS.DocumentDirectoryPath}/${filename}`,
            android: `${RNFS.DownloadDirectoryPath}/${filename}`,
        });

        try {
            const { statusCode } = await RNFS.downloadFile({
                fromUrl: selectedImage,
                toFile: downloadPath,
            }).promise;

            if (statusCode === 200) {
                await CameraRoll.save(
                    Platform.OS === 'ios'
                        ? `file://${downloadPath}`
                        : downloadPath,
                    { type: 'photo', album: 'Download' },
                );
                showModalToast('Зураг амжилттай хадгалагдлаа');

                if (Platform.OS === 'ios') await RNFS.unlink(downloadPath);
            } else {
                showModalToast('Татахад алдаа гарлаа');
            }
        } catch (err) {
            console.error('Download error:', err);
            showModalToast('Татаж авах үед алдаа гарлаа');
        }
    }, [selectedImage, showModalToast]);

    const keyExtractor = useCallback(item => item.id.toString(), []);

    const renderItem = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.card}
                onPress={() => handleImagePress(index)}
            >
                <Image
                    source={{ uri: `${item.image}` }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        ),
        [handleImagePress],
    );

    const renderModalImage = useCallback(
        ({ item }) => (
            <View style={styles.fullImageWrapper}>
                <Image
                    source={{ uri: `${item.image}` }}
                    style={styles.modalImage}
                    resizeMode="contain"
                />
            </View>
        ),
        [],
    );

    if (loading) return <PhotosSkeleton />;

    return (
        <>
            <StatusBar
                barStyle="light-content"
                backgroundColor={modalVisible ? COLORS.black : COLORS.primary}
                animated
            />

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<NoData />}
            />

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <FlatList
                        data={data}
                        renderItem={renderModalImage}
                        keyExtractor={keyExtractor}
                        horizontal
                        pagingEnabled
                        ref={flatListRef}
                        initialScrollIndex={selectedIndex}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        onMomentumScrollEnd={e =>
                            setSelectedIndex(
                                Math.round(
                                    e.nativeEvent.contentOffset.x / width,
                                ),
                            )
                        }
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoData />}
                    />

                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.closeButton}
                    >
                        <X size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={handleDownload}
                    >
                        <Download size={30} color="#fff" />
                    </TouchableOpacity>

                    {modalToast && (
                        <Animated.View
                            style={[
                                styles.modalToast,
                                {
                                    opacity: toastOpacity,
                                    transform: [
                                        {
                                            translateY:
                                                toastOpacity.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [30, 0],
                                                }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Text style={styles.modalToastText}>
                                {modalToast}
                            </Text>
                        </Animated.View>
                    )}
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    listContent: { padding: 12, flexGrow: 1 },
    row: { justifyContent: 'space-between', marginBottom: IMAGE_MARGIN },
    card: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderColor: '#C0C0C0',
        borderWidth: 1,
        ...shadow,
    },
    image: { width: ITEM_SIZE, height: ITEM_SIZE },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
    fullImageWrapper: {
        width: width,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: { width: '99%', height: '99%' },
    downloadButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 70 : 24,
        left: 30,
        backgroundColor: '#000',
        padding: 14,
        borderRadius: 30,
        ...shadow,
    },
    closeButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 70 : 24,
        right: 30,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 30,
        ...shadow,
    },
    modalToast: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        opacity: 0.9,
        zIndex: 999,
    },
    modalToastText: { color: '#fff', fontSize: 14, textAlign: 'center' },
});
