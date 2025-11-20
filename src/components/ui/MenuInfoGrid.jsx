import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Info, FolderOpen, PlayCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const menuItems = [
    {
        title: 'Мэдээ мэдээлэл',
        icon: Info,
        route: 'NewsInformation',
    },
    {
        title: 'Файлын сан',
        icon: FolderOpen,
        route: 'FileArchive',
    },
    {
        title: 'Чуулган үзэх',
        icon: PlayCircle,
        route: 'WatchSession',
    },
];

export default function MenuInfoGrid() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>МЭДЭЭЛЭЛ АВАХ ЦЭСҮҮД</Text>
            <FlatList
                data={menuItems}
                numColumns={isTablet ? 4 : 3}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => {
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => {
                                if (item.route === 'FileArchive') {
                                    navigation.navigate('WebView', {
                                        url: 'https://nith.ulaanbaatar.mn/pwa/file-archive',
                                        title: 'Файлын сан',
                                    });
                                } else if (item.route === 'WatchSession') {
                                    navigation.navigate('WebView', {
                                        url: 'https://nith.ulaanbaatar.mn/pwa/watch-session',
                                        title: 'Чуулган үзэх',
                                    });
                                } else {
                                    navigation.navigate('Screen', {
                                        screen: item.route,
                                    });
                                }
                            }}
                        >
                            <View style={styles.iconWrapper}>
                                <Icon
                                    size={isTablet ? 56 : 42}
                                    color="white"
                                    strokeWidth={1.3}
                                />
                            </View>
                            <Text style={styles.label}>{item.title}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: isTablet ? 30 : 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: isTablet ? 28 : 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: isTablet ? 30 : 20,
    },
    grid: {
        alignItems: 'center',
        paddingBottom: isTablet ? 30 : 10,
    },
    item: {
        width: isTablet ? 140 : 100,
        margin: isTablet ? 20 : 10,
        alignItems: 'center',
    },
    iconWrapper: {
        backgroundColor: COLORS.primary,
        padding: isTablet ? 28 : 20,
        borderRadius: isTablet ? 40 : 30,
        marginBottom: isTablet ? 12 : 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        textAlign: 'center',
        fontSize: isTablet ? 20 : 13,
        fontWeight: 'bold',
    },
});
