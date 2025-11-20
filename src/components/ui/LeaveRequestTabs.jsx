import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS, shadow } from '@/constants/theme';

export const LeaveRequestTabs = ({ selectedTab, onChange }) => (
    <View style={styles.tabContainer}>
        <TouchableOpacity
            style={[
                styles.tab,
                selectedTab === 'notApproved' && styles.activeTab,
            ]}
            onPress={() => onChange('notApproved')}
        >
            <Text
                style={[
                    styles.tabText,
                    selectedTab === 'notApproved' && styles.activeTabText,
                ]}
            >
                Шийдэгдээгүй
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.tab, selectedTab === 'approved' && styles.activeTab]}
            onPress={() => onChange('approved')}
        >
            <Text
                style={[
                    styles.tabText,
                    selectedTab === 'approved' && styles.activeTabText,
                ]}
            >
                Шийдэгдсэн
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        marginHorizontal: 16,
        marginBottom: 16,
        overflow: 'hidden',
        ...shadow,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        ...shadow,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        color: '#888',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
});
