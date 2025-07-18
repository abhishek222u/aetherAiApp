import { View, Text, SafeAreaView, StyleSheet, Image, Touchable, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { styles } from './Styles'
import Colors from '../../constants/colors'

const LoginScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('user');
    const [phone, setPhone] = useState('');
    const [textInput1, onChangeTextInput1] = useState('');
    const [textInput2, onChangeTextInput2] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.headerImage}
                resizeMode="cover"
            />
            <Text style={styles.headerText}>Welcome!</Text>

            <View style={styles.tabContainer}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: activeTab === 'user' ? Colors.greenColor : Colors.grayColor }}>
                    <TouchableOpacity style={styles.tabWrapper}
                        onPress={() => setActiveTab('user')}>
                        {activeTab === 'user' ? (
                            <Image
                                source={require('../../assets/images/UserImg.png')}
                            />
                        ) : (
                            <Image
                                source={require('../../assets/images/agent.png')}
                            />
                        )}

                        <Text style={{ ...styles.tabText, color: activeTab === 'user' ? Colors.greenColor : Colors.grayColor }}>User Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: activeTab === 'agent' ? Colors.greenColor : Colors.grayColor }}>
                    <TouchableOpacity style={styles.tabWrapper}
                        onPress={() => setActiveTab('agent')}>
                        {activeTab === 'agent' ? (
                            <Image
                                source={require('../../assets/images/UserImg.png')}
                            />
                        ) : (
                            <Image
                                source={require('../../assets/images/agent.png')}
                            />
                        )}
                        <Text style={{ ...styles.tabText, color: activeTab === 'agent' ? Colors.greenColor : Colors.grayColor }}>Agent Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

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
            {activeTab === 'agent' && (
                <View>
                    <Text style={styles.inputText}>Email Address</Text>
                    <View style={styles.agentInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#6B7280"
                            placeholder="Enter your email"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <Text style={styles.inputText}>Password</Text>
                    <View style={styles.agentInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#6B7280"
                            placeholder="Enter your password"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>
            )}

            <TouchableOpacity
                style={styles.otpButton}
                onPress={() => navigation.navigate('Verification')}
            >
                <Text style={styles.otpText}>{activeTab === 'user' ? 'Request OTP' : 'Login'}</Text>
            </TouchableOpacity>
            {activeTab === 'agent' && (
                <Text style={styles.signupText}>
                    Don’t have an account?{' '}
                    <Text style={{ color: Colors.greenColor }}>Signup</Text>
                </Text>
            )}
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

        </SafeAreaView>
    )
}

export default LoginScreen