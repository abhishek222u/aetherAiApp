import {
    View, Text, SafeAreaView, StyleSheet, Image,
    TouchableOpacity, TextInput, Alert, KeyboardAvoidingView,
    ScrollView, Platform, Keyboard
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const LoginScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('user');
    const [phone, setPhone] = useState('');
    const [agentEmail, setAgentEmail] = useState('');
    const [agentPassword, setAgentPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const { loginUser } = useContext(UserContext);

    const handleLogin = async () => {
        if (activeTab == 'user') {

            try {
                setLoading(true);
                // console.log(phone, 'phone')
                const response = await axios.post(
                    "http://172.20.10.4:4000/auth/request-otp",
                    { phone },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                if (response.status == 200) {
                    console.log(response.data, 'response');
                    setPhone('');
                    Alert.alert("Success", "Otp Send successfully");
                    navigation.navigate('Verification', { responseData: response.data });
                }
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Login failed. Please try again.");
            } finally {
                setLoading(false);
            }

        } else {
            if (!agentEmail || !agentPassword) {
                Alert.alert("Error", "Please enter email and password");
                return;
            }
            try {
                setLoading(true);
                const response = await axios.post("http://172.20.10.4:4000/auth/agent-login", {
                    email: agentEmail,
                    password: agentPassword
                });
                loginUser(response?.data?.agent?.agent_id);
                Alert.alert("Success", "Login successful");
                navigation.navigate('UpgradePlan');
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Login failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAgentSignUp = () => {
        navigation.navigate('PersonalDetail', { type: 'agent' });
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
            {/* ✅ KeyboardAvoidingView for smooth scrolling when keyboard opens */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust offset if needed
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.headerText}>Welcome!</Text>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: activeTab === 'user' ? Colors.greenColor : Colors.grayColor }}>
                            <TouchableOpacity style={styles.tabWrapper}
                                onPress={() => setActiveTab('user')}>
                                {activeTab === 'user' ? (
                                    <Image source={require('../../assets/images/UserImg.png')} />
                                ) : (
                                    <Image source={require('../../assets/images/agent.png')} />
                                )}
                                <Text style={{ ...styles.tabText, color: activeTab === 'user' ? Colors.greenColor : Colors.grayColor }}>User Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: activeTab === 'agent' ? Colors.greenColor : Colors.grayColor }}>
                            <TouchableOpacity style={styles.tabWrapper}
                                onPress={() => setActiveTab('agent')}>
                                {activeTab === 'agent' ? (
                                    <Image source={require('../../assets/images/UserImg.png')} />
                                ) : (
                                    <Image source={require('../../assets/images/agent.png')} />
                                )}
                                <Text style={{ ...styles.tabText, color: activeTab === 'agent' ? Colors.greenColor : Colors.grayColor }}>Agent Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User Input */}
                    {activeTab === 'user' && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.countryCode}>🇮🇳 +91</Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="#000000"
                                placeholder="Phone number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    )}

                    {/* Agent Input */}
                    {activeTab === 'agent' && (
                        <View>
                            <Text style={styles.inputText}>Email Address</Text>
                            <View style={styles.agentInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#6B7280"
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    value={agentEmail}
                                    onChangeText={setAgentEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            <Text style={styles.inputText}>Password</Text>
                            <View style={styles.agentInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#6B7280"
                                    placeholder="Enter your password"
                                    secureTextEntry
                                    value={agentPassword}
                                    onChangeText={setAgentPassword}
                                />
                            </View>
                        </View>
                    )}

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.otpButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.otpText}>{activeTab === 'user' ? 'Request OTP' : 'Login'}</Text>
                    </TouchableOpacity>

                    {/* Signup for agent */}
                    {activeTab === 'agent' && (
                        <Text style={styles.signupText}>
                            Don’t have an account?{' '}
                            <Text style={{ color: Colors.greenColor }} onPress={() => handleAgentSignUp()}>Signup</Text>
                        </Text>
                    )}

                    {/* Footer for user */}
                    {activeTab === 'user' && (
                        <>
                            <Text style={styles.poweredBy}>Powered by</Text>
                            <View style={styles.footerImageView}>
                                <Image
                                    source={require('../../assets/images/AetherLogo.png')}
                                    style={styles.footerImage}
                                />
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'UrbanistBlack',
    },
    headerImage: {
        width: '100%',
        height: moderateScale(330),
    },
    headerText: {
        fontSize: scale(25),
        textAlign: 'center',
        fontFamily: 'UrbanistSemiBold',
    },
    tabContainer: {
        flexDirection: 'row',
        gap: moderateScale(1),
        justifyContent: 'center',
        marginTop: verticalScale(5),
    },
    tabWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateVerticalScale(2),
        paddingHorizontal: moderateScale(20),
    },
    tabText: {
        fontSize: scale(16),
        padding: moderateScale(10),
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderRadius: 16,
        marginTop: moderateScale(10),
        paddingHorizontal: moderateScale(25),
        marginHorizontal: moderateScale(15),
        paddingVertical: moderateScale(5),
    },
    agentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderRadius: 16,
        marginTop: moderateScale(10),
        paddingHorizontal: moderateScale(25),
        marginHorizontal: moderateScale(17),
        paddingVertical: moderateScale(5),
    },
    inputText: {
        marginTop: moderateScale(10),
        marginHorizontal: moderateScale(17),
        color: '#6B7280',
    },
    countryCode: {
    },
    input: {
        flex: 1,
        color: '#000',
    },
    otpButton: {
        marginTop: moderateScale(20),
        backgroundColor: '#31916E',
        borderRadius: 24,
        alignItems: 'center',
        paddingHorizontal: moderateScale(25),
        marginHorizontal: moderateScale(15),
        height: moderateScale(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        fontSize: scale(14),
        textAlign: 'center',
        marginTop: moderateScale(4),
        color: '#4B5563',
    },
    otpText: {
        color: '#fff',
        fontSize: scale(18),
        textAlign: 'center',
    },
    poweredBy: {
        textAlign: 'center',
        marginTop: moderateScale(80),
        color: '#808080',
        fontSize: scale(14),
    },
    footerImageView: {
        marginTop: moderateScale(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerImage: {
        height: moderateScale(32),
        width: moderateVerticalScale(109),
    },
});