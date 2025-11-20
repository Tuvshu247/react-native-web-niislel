import RequestCard from '@/components/ui/ApproveRequestCard';
import { ScrollView, StyleSheet } from 'react-native';
import NoData from '@/components/ui/NoData';

export default function UnresolvedRequests({ data }) {
    if (!data || data.length === 0) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <NoData />
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {data.map(item => (
                <RequestCard key={item.id} item={item} />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 150,
        paddingHorizontal: 16,
    },
});
