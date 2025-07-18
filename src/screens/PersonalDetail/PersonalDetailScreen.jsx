import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Keyboard } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Colors from '../../constants/colors';

const PersonalDetailScreen = ({ navigation }) => {
    const [focusedInput, setFocusedInput] = useState(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const inputRefs = useRef({});

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
                        <TouchableOpacity style={styles.backButton}>
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
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'email' && styles.highlightedInput]}
                            placeholder="Email"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)} />

                        <Text style={styles.label}>Emergency Contact</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'emergency' && styles.highlightedInput]}
                            placeholder="Alternate mobile number"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('emergency')}
                            onBlur={() => setFocusedInput(null)}
                        />

                        <Text style={styles.label}>House/Flat Number*</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'house' && styles.highlightedInput]}
                            placeholder="Enter landmark"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('house')}
                            onBlur={() => setFocusedInput(null)} />

                        <Text style={styles.label}>Country*</Text>
                        <TextInput
                            style={[styles.input, focusedInput === 'country' && styles.highlightedInput]}
                            placeholder="Enter country name"
                            placeholderTextColor="#6B7280"
                            onFocus={() => setFocusedInput('country')}
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
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat')}>
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