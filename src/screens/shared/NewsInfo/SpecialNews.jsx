import NewsCard from '@/components/ui/NewsCard';
import NoData from '@/components/ui/NoData';
import { shadow } from '@/constants/theme';
import { FlatList, StyleSheet } from 'react-native';

export default function SpecialNews({ search, data }) {
    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <NewsCard item={item} />}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={<NoData />}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 16,
        flexGrow: 1,
        ...shadow,
    },
});
