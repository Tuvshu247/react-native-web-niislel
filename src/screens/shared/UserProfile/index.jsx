import { useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IMAGE_URL } from '@/constants/urls';
import { useApi } from '@/hooks/useApi';
import { shadow, COLORS } from '@/constants/theme';
import { ArrowLeft, Facebook, Twitter } from 'lucide-react-native';

export default function UserProfile() {
    const { data, request, loading } = useApi();
    const navigation = useNavigation();

    useEffect(() => {
        request('user_info/');
    }, [request]);

    if (loading || !data) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.big_container}>
            <ImageBackground
                style={styles.backgroundImage}
                source={require('@/assets/images/background.png')}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.fixedHeader}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <ArrowLeft size={28} color="#333" />
                        </TouchableOpacity>
                        <Image
                            source={
                                data.profile
                                    ? { uri: `${IMAGE_URL}${data.profile}` }
                                    : require('@/assets/images/default-user.png')
                            }
                            style={styles.profileImage}
                        />
                        <Text style={styles.fullName}>{data.full_name}</Text>
                        <Text style={styles.role}>
                            {data.positions?.[0]?.position_description}
                        </Text>
                    </View>

                    <View style={styles.socialStats}>
                        <View style={styles.statBox}>
                            <Facebook size={32} color="#3b5998" />
                            <Text style={styles.statText}>
                                {data.facebook_followers} дагагч
                            </Text>
                        </View>
                        <View style={styles.statBox}>
                            <Twitter size={32} color="#1DA1F2" />
                            <Text style={styles.statText}>
                                {data.twitter_followers} дагагч
                            </Text>
                        </View>
                    </View>

                    <View style={styles.contactBox}>
                        <Text style={styles.label}>Төрсөн огноо:</Text>
                        <Text style={styles.value}>{data.birth_date}</Text>

                        <Text style={styles.label}>Утас:</Text>
                        <Text style={styles.value}>{data.phone_number}</Text>

                        <Text style={styles.label}>Имэйл:</Text>
                        <Text
                            style={styles.link}
                            onPress={() =>
                                Linking.openURL(`mailto:${data.email}`)
                            }
                        >
                            {data.email}
                        </Text>

                        <Text style={styles.label}>Facebook:</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(data?.facebook)}
                        >
                            <Text style={styles.link}>{data?.facebook}</Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>X (Twitter):</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(data.twitter)}
                        >
                            <Text style={styles.link}>{data.twitter}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.positionSection}>
                        <Text style={styles.sectionTitle}>Албан тушаал</Text>
                        {data.positions.map(position => (
                            <View key={position.id} style={styles.positionCard}>
                                <Text style={styles.positionName}>
                                    {position.position_name}
                                </Text>
                                <Text style={styles.positionDesc}>
                                    {position.position_description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    big_container: {
        flex: 1,
    },
    fixedHeader: {
        alignItems: 'center',
        paddingTop: 100,
        paddingBottom: 40,
        zIndex: 10,
        ...shadow,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    backgroundImage: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 70,
        left: 0,
        zIndex: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#ffffff',
        alignSelf: 'center',
        ...shadow,
    },
    fullName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222',
        marginBottom: 4,
        alignSelf: 'center',
    },
    role: {
        fontSize: 16,
        color: '#888',
        marginBottom: 16,
        alignSelf: 'center',
    },
    socialStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 24,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        minWidth: 120,
        ...shadow,
    },
    statText: {
        fontSize: 14,
        marginTop: 6,
        color: '#333',
    },
    contactBox: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 20,
        ...shadow,
    },
    label: {
        fontWeight: '600',
        marginTop: 12,
        color: '#444',
        fontSize: 14,
    },
    value: {
        color: '#222',
        fontSize: 15,
        marginTop: 2,
    },
    link: {
        color: COLORS.primary,
        fontSize: 15,
        marginTop: 2,
    },
    positionSection: {
        width: '100%',
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222',
        alignSelf: 'flex-start',
    },
    positionCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        ...shadow,
    },
    positionName: {
        fontWeight: '600',
        color: '#333',
        fontSize: 16,
    },
    positionDesc: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
});
