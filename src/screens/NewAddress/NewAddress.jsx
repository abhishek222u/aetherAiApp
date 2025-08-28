import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {
    moderateScale,
    scale,
    verticalScale,
} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const AddNewAddress = ({ navigation }) => {
    const [selectedType, setSelectedType] = useState('Home');
    const [flatNumber, setFlatNumber] = useState('');
    const [streetArea, setStreetArea] = useState('');
    const [landmark, setLandmark] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useContext(UserContext);


    const renderAddressType = (type) => (
        <TouchableOpacity
            key={type}
            style={[
                styles.addressTypeButton,
                selectedType === type && styles.selectedTypeButton,
            ]}
            onPress={() => setSelectedType(type)}
        >
            <Text
                style={[
                    styles.addressTypeText,
                    selectedType === type && styles.selectedTypeText,
                ]}
            >
                {type}
            </Text>
        </TouchableOpacity>
    );

    const handleSave = async () => {
        if (!flatNumber.trim() || !streetArea.trim() || !country.trim() || !postalCode.trim() || !city.trim()) {
            Alert.alert('Error', 'Please fill all required fields.');
            return;
        }

        const payload = {
            "user_id": "b03fa39f-e31d-4f50-b20c-e4c3adfe0a6a",
            // "user_id": userId,
            address_label: selectedType,
            street_address: `${flatNumber} ${streetArea}`,
            city: city,
            state: "Maharashtra",
            landmark,
            country: country,
            pincode: postalCode,
            latitude: 19.0760,
            longitude: 72.8777,
        };

        try {
            setLoading(true);

            const response = await axios.post('http://74.225.157.233:9000/api/v1/addresses', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // console.log(response, 'response');

            const data = await response.data;

            if (response.status === 200) {
                Alert.alert('Success', 'Address saved successfully!');
                // navigation.goBack();
            } else {
                Alert.alert('Error', data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.log(error, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Ionicons name="arrow-back" size={moderateScale(20)} color="#2F8D46" />
                        <Text style={styles.headerTitle}>Add New Address</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>House/Flat Number*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter flat number"
                            placeholderTextColor={'#6B7280'}
                            value={flatNumber}
                            onChangeText={setFlatNumber}
                        />

                        <Text style={styles.label}>Street/Area*</Text>
                        <TextInput style={styles.input} placeholder="Enter street/area"
                            placeholderTextColor={'#6B7280'}
                            value={streetArea}
                            onChangeText={setStreetArea} />

                        <Text style={styles.label}>Landmark(Optional)</Text>
                        <TextInput style={styles.input} placeholder="Enter landmark"
                            placeholderTextColor={'#6B7280'}
                            value={landmark}
                            onChangeText={setLandmark} />

                        <Text style={styles.label}>Country*</Text>
                        <TextInput style={styles.input} placeholder="Enter country name" placeholderTextColor={'#6B7280'}
                            value={country}
                            onChangeText={setCountry}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Postal Code*</Text>
                                <TextInput style={styles.input} placeholder="Enter code"
                                    placeholderTextColor={'#6B7280'}
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                    keyboardType="numeric" />
                            </View>

                            <View style={styles.halfInput}>
                                <Text style={styles.label}>City*</Text>
                                <TextInput style={styles.input} placeholder="Enter city name"
                                    placeholderTextColor={'#6B7280'}
                                    value={city}
                                    onChangeText={setCity} />
                            </View>
                        </View>

                        <Text style={styles.label}>Address Type</Text>
                        <View style={styles.addressTypeContainer}>
                            {['Home', 'Work', 'Other'].map(renderAddressType)}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Save & Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddNewAddress;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'UrbanistBlack',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: moderateScale(20),
    },
    headerTitle: {
        fontSize: moderateScale(25),
        fontWeight: '700',
        color: '#2F8D46',
        marginLeft: scale(30),
        fontFamily: 'UrbanistSemiBold',
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: scale(20),
        justifyContent: 'space-between',
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: moderateScale(13),
        color: '#6B7280',
        marginBottom: verticalScale(12),
    },
    input: {
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderRadius: scale(10),
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(12),
        fontSize: moderateScale(13),
        marginBottom: verticalScale(15),
        backgroundColor: '#F9FAFB',
        color: 'black'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    addressTypeContainer: {
        flexDirection: 'row',
        gap: moderateScale(15),
        marginBottom: verticalScale(20),
    },
    addressTypeButton: {
        borderWidth: 1,
        borderColor: '#6B7280',
        borderRadius: scale(20),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(16),
    },
    addressTypeText: {
        color: '#6B7280',
        fontSize: moderateScale(13),
    },
    selectedTypeButton: {
        backgroundColor: '#E6F7EC',
        borderColor: Colors.greenColor,
    },
    selectedTypeText: {
        color: Colors.greenColor,
        fontWeight: '600',
    },
    button: {
        backgroundColor: Colors.greenColor,
        borderRadius: scale(30),
        paddingVertical: verticalScale(14),
        alignItems: 'center',
        marginTop: verticalScale(10),
    },
    buttonText: {
        color: '#fff',
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
});
