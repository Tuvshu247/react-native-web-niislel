import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import { SkeletonBox } from '../utils/SkeletonBox';

const NUM_COLUMNS = 3;
const IMAGE_MARGIN = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / NUM_COLUMNS - IMAGE_MARGIN * 2;

export default function PhotosSkeleton() {
    return (
        <View style={styles.container}>
            <FlatList
                data={Array.from({ length: 13 })}
                numColumns={NUM_COLUMNS}
                keyExtractor={(_, index) => index.toString()}
                renderItem={() => (
                    <View style={styles.imageBox}>
                        <SkeletonBox />
                    </View>
                )}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: IMAGE_MARGIN,
    },
    imageBox: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
    },
});
