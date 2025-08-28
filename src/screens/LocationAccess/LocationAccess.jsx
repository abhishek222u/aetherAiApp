import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import Colors from '../../constants/colors';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const LocationAccess = ({ navigation }) => {
    const requestLocationPermission = async () => {
        try {
            let permission;

            if (Platform.OS === 'android') {
                permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
            } else if (Platform.OS === 'ios') {
                permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
            }

            const result = await check(permission);

            if (result === RESULTS.GRANTED) {
                // Alert.alert('Permission already granted', 'You have already given location permission.');
                navigation.navigate('MapScreen');
            } else {
                const reqResult = await request(permission);

                if (reqResult === RESULTS.GRANTED) {
                    // Alert.alert('Permission granted', 'Thank you for granting location access!');
                    navigation.navigate('MapScreen');
                } else {
                    Alert.alert('Permission denied', 'Location permission denied. Please allow it from settings.');
                }
            }
        } catch (error) {
            console.warn(error);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                    <Image
                        source={require('../../assets/images/newlocation.png')}
                        style={styles.iconImage}
                    />
                </View>
            </View>

            <Text style={styles.title}>Allow Location Access</Text>
            <Text style={styles.subtitle}>
                We need your location to deliver medicines{'\n'}to your doorstep
            </Text>

            <TouchableOpacity style={styles.allowButton} onPress={requestLocationPermission}>
                <Text style={styles.allowButtonText}>Allow Location Access</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.manualButton} onPress={() => navigation.navigate('AddNewAddress')}>
                <Text style={styles.manualButtonText}>Enter Address Manually</Text>
            </TouchableOpacity>

            <Text style={styles.footerLock}>🔒 Pharmakart Protected</Text>
        </View>
    );
};

export default LocationAccess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: scale(20),
        fontFamily: 'UrbanistBlack',
    },
    iconContainer: {
        marginBottom: verticalScale(30),
    },
    iconBackground: {
        backgroundColor: '#E4FCEC',
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: scale(21),
        height: scale(27),
    },
    // iconText: {
    //     fontSize: moderateScale(26),
    // },
    title: {
        fontSize: moderateScale(20),
        fontFamily: 'UrbanistSemiBold',
        fontWeight: 700,
        color: '#1C1C1C',
        marginBottom: verticalScale(10),
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: '#898996',
        textAlign: 'center',
        fontWeight: 500,
        marginBottom: verticalScale(40),
    },
    allowButton: {
        backgroundColor: Colors.greenColor,
        borderRadius: scale(30),
        width: '100%',
        paddingVertical: verticalScale(14),
        marginBottom: verticalScale(20),
        alignItems: 'center',
    },
    allowButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
    manualButton: {
        borderColor: Colors.greenColor,
        borderWidth: 1,
        borderRadius: scale(30),
        width: '100%',
        paddingVertical: verticalScale(14),
        alignItems: 'center',
    },
    manualButtonText: {
        color: Colors.greenColor,
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
    footerLock: {
        marginTop: verticalScale(16),
        fontSize: moderateScale(12),
        color: '#4B5563',
        fontWeight: 400,
    },
});
