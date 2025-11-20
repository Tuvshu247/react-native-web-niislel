import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as LucideIcons from 'lucide-react-native';

export const MenuItem = ({ icon, label, path }) => {
    const navigation = useNavigation();

    const IconComponent = LucideIcons[icon] || LucideIcons.Circle;

    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                if (path) navigation.navigate('Screen', { screen: path });
            }}
        >
            <IconComponent size={20} color="#0057FF" />
            <Text style={styles.menuText}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    menuText: {
        marginLeft: 14,
        fontSize: 16,
        color: '#333',
    },
});
