import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid, Linking, Platform, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { MapView, Camera, PointAnnotation, UserLocation } from "@maplibre/maplibre-react-native";
import GetLocation from 'react-native-get-location';

const MapScreen = ({ navigation, route }) => {
    const { onAddressSelected } = route.params || {};
    const defaultRegion = {
        latitude: 37.7649,
        longitude: -122.4661,
    };

    const [location, setLocation] = useState(defaultRegion);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);

    const getLocation = async () => {
        try {
            setError(null);
            setLoading(true);

            // Check permissions on Android
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    throw new Error('Location permission denied');
                }
            }

            const result = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            });


            setLocation({
                latitude: result.latitude,
                longitude: result.longitude,
            });
        } catch (e) {
            console.warn('Location error:', e);
            setError(e.message);
            setLocation(defaultRegion);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const handleConfirmLocation = () => {
        const formattedAddress = {
            address_id: `location_${Date.now()}`,
            address_label: 'Current Location',
            formatted_address: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
            latitude: location.latitude,
            longitude: location.longitude,
        };

        if (onAddressSelected) {
            onAddressSelected(formattedAddress);
        }
        navigation.goBack();
    };

    const handleBackPress = () => {
        navigation.navigate('LocationAccess');
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#31916E" />
                <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
            >
                <Icon name="arrow-left" size={moderateScale(20)} color="#000" />
            </TouchableOpacity>

            {/* Map View */}
            <MapView
                style={styles.map}
                onDidFinishLoadingMap={() => setMapLoaded(true)}
                styleURL="https://demotiles.maplibre.org/style.json"
                logoEnabled={false}
            >
                <Camera
                    zoomLevel={14}
                    centerCoordinate={[location.longitude, location.latitude]}
                    animationMode={'flyTo'}
                    animationDuration={2000}
                />

                {/* User location */}
                <UserLocation
                    visible={true}
                    animated={true}
                />

                {/* Static marker */}
                {mapLoaded && (
                    <PointAnnotation
                        id="user-location"
                        coordinate={[location.longitude, location.latitude]}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.marker} />
                        </View>
                    </PointAnnotation>
                )}
            </MapView>

            {/* Error message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Bottom Card */}
            <View style={styles.bottomCard}>
                <Text style={styles.locationTitle}>Your Location</Text>
                <View style={styles.locationRow}>
                    <Icon name="map-pin" size={moderateScale(18)} color="#31916E" />
                    <Text style={styles.addressText}>
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmLocation}
                >
                    <Text style={styles.confirmButtonText}>Confirm Location</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: 'UrbanistBlack',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: verticalScale(16),
        fontSize: moderateScale(16),
        color: '#373743',
    },
    map: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: verticalScale(40),
        left: scale(15),
        zIndex: 10,
        backgroundColor: '#fff',
        padding: moderateScale(8),
        borderRadius: moderateScale(50),
        elevation: 3,
    },
    bottomCard: {
        position: 'absolute',
        bottom: verticalScale(20),
        left: scale(15),
        right: scale(15),
        backgroundColor: '#fff',
        padding: moderateScale(15),
        borderRadius: moderateScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    locationTitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: '#373743',
        marginBottom: verticalScale(8),
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    addressText: {
        marginLeft: scale(8),
        fontSize: moderateScale(14),
        color: '#333',
        flex: 1,
        flexWrap: 'wrap',
    },
    confirmButton: {
        backgroundColor: '#31916E',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(20),
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: moderateScale(15),
        fontWeight: '600',
    },
    markerContainer: {
        width: moderateScale(24),
        height: moderateScale(24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    marker: {
        width: moderateScale(16),
        height: moderateScale(16),
        borderRadius: moderateScale(8),
        backgroundColor: '#31916E',
        borderWidth: moderateScale(2),
        borderColor: '#fff',
    },
    errorContainer: {
        position: 'absolute',
        top: verticalScale(80),
        left: scale(20),
        right: scale(20),
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        padding: moderateScale(10),
        borderRadius: moderateScale(8),
    },
    errorText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default MapScreen;