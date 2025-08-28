import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, PermissionsAndroid, Platform, Alert } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ScrollView } from 'react-native';

const OfferModal = forwardRef(({ offer, onConfirm, onClose, navigation, userAddress, onAddressSelected }, ref) => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const checkLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    navigation.navigate('MapScreen', { onAddressSelected });
                } else {
                    navigation.navigate('LocationAccess');
                }
            } catch (err) {
                console.warn(err);
                navigation.navigate('Chat');
            }
        } else {
            Alert.alert(
                'Location Permission',
                'Please enable location services in settings',
                [
                    {
                        text: 'Cancel',
                        onPress: () => navigation.navigate('Chat'),
                        style: 'cancel',
                    },
                    {
                        text: 'Settings',
                        onPress: () => Linking.openSettings(),
                    },
                ],
            );
        }
    };

    // NEW: Handle address selection
    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    // NEW: Handle continue button press
    const handleContinue = () => {
        if (selectedAddress) {
            // console.log(selectedAddress, 'selectedAddress')
            onAddressSelected(selectedAddress);
            onClose();
        } else {
            Alert.alert('Error', 'Please select an address before continuing.');
        }
    };

    return (
        <Modalize
            ref={ref}
            modalStyle={styles.modal}
            handleStyle={styles.handle}
            onClosed={onClose}
            adjustToContentHeight={true}
            withHandle={true}
            modalTopOffset={100}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Delivery Address</Text>

                <TouchableOpacity
                    style={styles.optionContainer}
                    onPress={checkLocationPermission}
                >
                    <View style={styles.iconCircle}>
                        <Text style={styles.icon}>
                            <Image
                                source={require('../assets/images/location.png')}
                                resizeMode="cover"
                            />
                        </Text>
                    </View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Use Current Location</Text>
                        <Text style={styles.optionSubtitle}>Detect your location automatically</Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('AddNewAddress')}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.icon}>
                            <Image
                                source={require('../assets/images/addresslogo.png')}
                                resizeMode="cover"
                            />
                        </Text>
                    </View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Enter New Address</Text>
                        <Text style={styles.optionSubtitle}>Add a new delivery location</Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>

                <Text style={styles.savedTitle}>Saved Address</Text>

                <ScrollView
                    style={{ maxHeight: verticalScale(200) }} // jitni height me scroll chahiye
                    showsVerticalScrollIndicator={false}
                >
                    {userAddress?.addresses.map((addres, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.optionContainer, selectedAddress?.address_id === addres.address_id ? styles.selectedOption : null]}
                                onPress={() => handleAddressSelect(addres)}>
                                <View style={styles.iconCircle}>
                                    <Text style={styles.icon}>
                                        <Image
                                            source={require('../assets/images/home.png')}
                                            resizeMode="cover"
                                        />
                                    </Text>
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>{addres?.address_label}</Text>
                                    <Text style={styles.optionSubtitle}>{addres?.formatted_address}</Text>
                                </View>
                                <Text style={styles.arrow}>›</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </Modalize>
    );
});

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        padding: moderateScale(16),
        zIndex: 1000,
    },
    handle: {
        backgroundColor: '#D3D3D3',
        width: scale(40),
        height: verticalScale(4),
        borderRadius: moderateScale(2),
        alignSelf: 'center',
    },
    contentContainer: {
        paddingVertical: verticalScale(8),
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: '#374151',
        marginBottom: verticalScale(16),
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: moderateScale(14),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(8),
        borderColor: '#F3F4F6'
    },
    selectedOption: {
        borderColor: '#31916E',
        borderWidth: 2,
    },
    iconCircle: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    icon: {
        fontSize: moderateScale(18),
        color: '#10B981',
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: moderateScale(16),
        color: '#374151',
        fontWeight: '500',
    },
    optionSubtitle: {
        fontSize: moderateScale(14),
        color: '#4B5563',
    },
    arrow: {
        fontSize: moderateScale(24),
        color: '#374151',
    },
    savedTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#374151',
        marginTop: verticalScale(16),
        marginBottom: verticalScale(8),
    },
    continueButton: {
        backgroundColor: '#31916E',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(24),
        alignItems: 'center',
        marginTop: verticalScale(16),
    },
    continueText: {
        fontSize: moderateScale(16),
        color: '#FFFFFF',
        fontWeight: '600',
    },
});


export default OfferModal;