import { useEffect, useState, useCallback } from 'react';
import {
    FlatList,
    Modal,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { LeaveRequestCard } from '@/components/ui/LeaveRequestCard';
import { LeaveRequestTabs } from '@/components/ui/LeaveRequestTabs';
import NoData from '@/components/ui/NoData';
import { NewsCardSkeleton } from '@/components/loaders/skeletons/NewsCardSkeleton';
import { getUserInfo } from '@/functions';
import { useApi } from '@/hooks/useApi';
import { COLORS, shadow } from '@/constants/theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function LeaveRequest() {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('notApproved');
    const { data, request, loading } = useApi();
    const { request: deleteRequest } = useApi();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [memberId, setMemberId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const fetchLogs = async () => {
                const user = await getUserInfo();
                if (user?.memberId) {
                    setMemberId(Number(user.memberId));
                    request(`member_leave_request/${user.memberId}/`);
                }
            };
            fetchLogs();
        }, [request]),
    );

    useEffect(() => {
        const fetchLogs = async () => {
            const user = await getUserInfo();
            if (user?.memberId) {
                setMemberId(Number(user.memberId));
                request(`member_leave_request/${user.memberId}/`);
            }
        };
        fetchLogs();
    }, [request]);

    const filteredData = data?.filter(item =>
        selectedTab === 'approved'
            ? item.status !== 'Хүлээгдэж байна'
            : item.status === 'Хүлээгдэж байна',
    );

    const handleDeletePress = item => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        await deleteRequest(
            `delete_leave_request/${selectedItem?.id}/`,
            'DELETE',
        );
        setModalVisible(false);
        if (memberId) {
            request(`member_leave_request/${memberId}/`);
        }
    };

    const handleNewRequest = () => {
        navigation.navigate('Screen', {
            screen: 'LeaveRequestSend',
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.greenButton}
                onPress={handleNewRequest}
            >
                <Text style={styles.greenButtonText}>+ ШИНЭ ХҮСЭЛТ ИЛГЭЭХ</Text>
            </TouchableOpacity>

            <LeaveRequestTabs
                selectedTab={selectedTab}
                onChange={setSelectedTab}
            />

            {loading ? (
                <View style={styles.skeletonContainer}>
                    {[...Array(3)].map((_, index) => (
                        <NewsCardSkeleton key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <LeaveRequestCard
                            item={item}
                            onDelete={() => handleDeletePress(item)}
                        />
                    )}
                    ListEmptyComponent={<NoData />}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Анхааруулга</Text>
                        <Text style={styles.modalMessage}>
                            Та чөлөөний хүсэлтийг устгахдаа итгэлтэй байна уу?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    styles.confirmButton,
                                ]}
                                onPress={handleConfirmDelete}
                            >
                                <Text style={styles.modalButtonText}>Тийм</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    styles.cancelButton,
                                ]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Үгүй</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        backgroundColor: COLORS.white,
    },
    greenButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 16,
        marginBottom: 16,
        ...shadow,
    },
    greenButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    skeletonContainer: {
        paddingHorizontal: 16,
    },
    listContent: {
        flexGrow: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        ...shadow,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        color: '#444',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 10,
    },
    confirmButton: {
        backgroundColor: '#2E7D32',
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
