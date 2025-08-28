import { View, Text, TouchableOpacity, Image, TextInput, SafeAreaView, Alert } from 'react-native'
import React, { useRef, useState, useContext } from 'react'
import { verificationStyles } from './Styles'
import Colors from '../../constants/colors'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { UserContext } from '../../context/UserContext.js';

const Verification = ({ navigation }) => {
    const { loginUser } = useContext(UserContext);
    const route = useRoute();
    const { responseData } = route.params;
    // console.log(responseData, 'responseData')

    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputs = useRef([]);

    // Function to handle input change
    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to next input automatically
        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }

        // If last box filled → auto submit
        if (index === 3 && text) {
            handleSubmit(newOtp);
        }
    };

    // Submit Function
    const handleSubmit = async (otpArray) => {
        if (otpArray.some(field => field === "")) {
            Alert.alert("Error", "Please enter all 4 digits of OTP");
            return;
        }

        const otpCode = otpArray.join(""); // join into single string

        try {
            const response = await axios.post(
                "http://172.20.10.4:4000/auth/verify-otp",
                { otp: otpCode, phone: responseData?.phone },
            );
            // console.log(response?.data);
            if (response.status == 200) {
                loginUser(responseData?.userId);
                Alert.alert("Success", "Otp Verified Successfully");
                if (response?.data?.data?.first_name == 'test') {
                    navigation.navigate('PersonalDetail', { responseData: response.data });
                }
                else {
                    navigation.navigate('Chat');
                }
                // console.log(response.data, 'response');
            }
        } catch (error) {
            console.error(error?.message);
            Alert.alert("Error", "Login failed. Please try again.");
        }
    };
    return (
        <SafeAreaView style={verificationStyles.container}>
            <TouchableOpacity style={verificationStyles.backButton} onPress={() => navigation.goBack()}>
                <Image
                    source={require('../../assets/images/backbutton.png')}
                    style={verificationStyles.backArrow}
                    resizeMode="cover"
                />
            </TouchableOpacity>
            <Text style={verificationStyles.title}>Code Verification</Text>
            <Text style={verificationStyles.subtitle}>
                We have sent a code to your phone number{'\n'}Enter it here to verify your identity
            </Text>
            <View style={verificationStyles.codeContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => inputs.current[index] = ref}
                        maxLength={1}
                        keyboardType="numeric"
                        textAlign="center"
                        style={verificationStyles.codeBox}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                    />
                ))}
            </View>
            <Text style={verificationStyles.timer}>00:36 <Text style={{ color: 'black' }}>Seconds</Text></Text>
            <TouchableOpacity style={verificationStyles.resendButton}>
                <Text style={verificationStyles.resendText}>Didn't receive the OTP? <Text style={{ color: Colors.greenColor }}>Resend</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity style={verificationStyles.verifyButton} onPress={() => handleSubmit(otp)}>
                <Text style={verificationStyles.verifyText}>Verify</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Verification