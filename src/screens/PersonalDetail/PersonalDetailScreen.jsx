import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Keyboard, Alert } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Colors from '../../constants/colors';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const PersonalDetailScreen = ({ navigation, route }) => {
    const [focusedInput, setFocusedInput] = useState(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const inputRefs = useRef({});
    const { type } = route.params || {};
    const newroute = useRoute();
    const { responseData } = newroute.params;

    // console.log(responseData?.data?.user_id, 'response')

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        emergency: '',
        house: '',
        country: '',
        postalCode: '',
        city: ''
    });

    // Handle input change
    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    // ✅ Submit form
    const handleSubmit = async () => {

        if (type != 'agent') {
            const mappedFormData = {
                user_id: String(responseData?.data?.user_id), // Ensure string to avoid type issues
                email: formData.email,
                fullname: formData.fullName, // Map fullName to fullname
                last_name: formData.fullName,
                address: formData.house, // Map house to address
                country: formData.country,
                postal_code: formData.postalCode, // Map postalCode to postal_code
                city: formData.city
            };

            try {
                const response = await axios.post('http://172.20.10.4:4000/auth/update-user', mappedFormData);

                if (response.status === 200 || response.status === 201) {
                    Alert.alert("Success", "Details submitted successfully!");
                    navigation.navigate('Chat'); // Navigate after success
                }
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Something went wrong while submitting");
            }
        } else {
            const mappedFormData = {
                email: formData.email,
                first_name: formData.fullName, // Map fullName to fullname
                last_name: formData.fullName,
                address: formData.house, // Map house to address
                business_name: formData.country,
                postal_code: formData.postalCode, // Map postalCode to postal_code
                city: formData.city
            };

            try {
                const response = await axios.post('http://172.20.10.4:4000/auth/create-agent', mappedFormData);

                if (response.status === 200 || response.status === 201) {
                    Alert.alert("Success", "Details submitted successfully!");
                    navigation.navigate('LoginScreen');
                }
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Something went wrong while submitting");
            }

        }
    };

    // Listen to keyboard show/hide events
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardVisible(true);
            // Scroll to the focused input
            if (focusedInput && inputRefs.current[focusedInput]) {
                inputRefs.current[focusedInput].measureLayout(
                    scrollViewRef.current,
                    (x, y) => {
                        scrollViewRef.current.scrollTo({ y: y - verticalScale(20), animated: true });
                    },
                    () => console.log('Failed to measure layout')
                );
            }
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [focusedInput]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={styles.innerContainer}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={true}
                    bounces={false} >
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Image
                                source={require('../../assets/images/backbutton.png')}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Personal Detail</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'fullName' && styles.highlightedInput]}
                            placeholder="Name"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('fullName')}
                            onBlur={() => setFocusedInput(null)}
                            onChangeText={(val) => handleChange('fullName', val)}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'email' && styles.highlightedInput]}
                            placeholder="Email"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('email')}
                            onChangeText={(val) => handleChange('email', val)}
                            onBlur={() => setFocusedInput(null)}
                        />

                        <Text style={styles.label}>Emergency Contact</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'emergency' && styles.highlightedInput]}
                            placeholder="Alternate mobile number"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('emergency')}
                            onBlur={() => setFocusedInput(null)}
                            onChangeText={(val) => handleChange('emergency', val)}
                        />

                        <Text style={styles.label}>{type == 'agent' ? 'Pharmacy/Store Name*' : 'House/Flat Number*'}</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'house' && styles.highlightedInput]}
                            placeholder="Enter landmark"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('house')}
                            onBlur={() => setFocusedInput(null)}
                            onChangeText={(val) => handleChange('house', val)} />

                        <Text style={styles.label}>Country*</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'country' && styles.highlightedInput]}
                            placeholder="Enter country name"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('country')}
                            onChangeText={(val) => handleChange('country', val)}
                            onBlur={() => setFocusedInput(null)}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Postal Code*</Text>
                                <TextInput style={[styles.input, focusedInput === 'postalCode' && styles.highlightedInput]}
                                    placeholder="Enter code"
                                    placeholderTextColor="#6B7280"
                                    onFocus={() => setFocusedInput('postalCode')}
                                    onBlur={() => setFocusedInput(null)}
                                    onChangeText={(val) => handleChange('postalCode', val)}
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>City*</Text>
                                <TextInput
                                    style={[styles.input, focusedInput === 'city' && styles.highlightedInput]}
                                    placeholder="Enter city name"
                                    placeholderTextColor="#6B7280"
                                    onFocus={() => setFocusedInput('city')}
                                    onBlur={() => setFocusedInput(null)}
                                    onChangeText={(val) => handleChange('city', val)}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Save & Continue</Text>
                        </TouchableOpacity>

                        <Text style={styles.securityText}>🛡️ Your information is secure and encrypted</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: 'UrbanistBlack',
        backgroundColor: '#fff',
    },
    innerContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        padding: moderateScale(10),
        backgroundColor: '#e0f7e0',
        alignItems: 'center',
    },
    headerText: {
        fontSize: scale(18),
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    headerContent: {
        flexDirection: 'row',
        gap: moderateScale(60),
    },
    title: {
        top: verticalScale(20),
        fontSize: moderateScale(25),
        fontWeight: 'bold',
        color: Colors.greenColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    backButton: {
        top: verticalScale(20),
        left: moderateScale(10),
        padding: moderateScale(10),
    },
    form: {
        padding: moderateScale(20),
    },
    label: {
        fontSize: scale(14),
        color: '#757575',
        marginBottom: verticalScale(5),
    },
    input: {
        height: verticalScale(50),
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: moderateScale(16),
        paddingHorizontal: moderateScale(16),
        marginBottom: verticalScale(15),
        backgroundColor: '#f5f5f5',
        color: 'black'
    },
    highlightedInput: {
        borderColor: '#2196f3',
        borderWidth: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    button: {
        backgroundColor: '#31916E',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(25),
        alignItems: 'center',
        marginTop: verticalScale(10),
    },
    buttonText: {
        color: '#fff',
        fontSize: scale(17),
        // fontWeight: 'bold',
    },
    securityText: {
        textAlign: 'center',
        color: '#757575',
        marginTop: verticalScale(10),
        fontSize: scale(12),
    },
});

export default PersonalDetailScreen