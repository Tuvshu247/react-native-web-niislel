import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const ScreenWrapper = ({
    children,
    showHeaderImage = true,
    headerText = '',
}) => {
    return (
        <View style={styles.wrapper}>
            {showHeaderImage ? (
                <ImageBackground
                    source={require('@/assets/images/header.png')}
                    style={styles.headerImage}
                    resizeMode="cover"
                >
                    <View style={styles.headerRow}>
                        {headerText ? (
                            <Text style={styles.headerText}>{headerText}</Text>
                        ) : null}
                    </View>
                </ImageBackground>
            ) : null}

            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginTop: isTablet ? -120 : 0,
        flex: 1,
        backgroundColor: 'white',
    },
    headerImage: {
        width: '100%',
        height: isTablet ? 280 : 120,
        justifyContent: 'center',
        paddingTop: isTablet ? 120 : 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        paddingLeft: isTablet ? 24 : 18,
    },
    headerText: {
        fontSize: isTablet ? 24 : 16,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: isTablet ? 48 : 18,
        textTransform: 'uppercase',
    },
    content: {
        flex: 1,
        paddingBottom: 50,
    },
});
