import RequestCard from '@/components/ui/ApproveRequestCard';
import { ScrollView, StyleSheet } from 'react-native';

export default function ResolvedRequests({ data }) {
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
