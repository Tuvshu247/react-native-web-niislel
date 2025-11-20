import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

const CustomHeader = ({ title }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
            </View>
        </SafeAreaView>
    );
};

export default CustomHeader;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: COLORS.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});
