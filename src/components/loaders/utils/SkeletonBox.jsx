import { View, StyleSheet } from 'react-native';
import { Shimmer } from './Shimmer';

export const SkeletonBox = ({ style }) => (
    <View style={[style, styles.base]}>
        <Shimmer />
    </View>
);

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
    },
});
