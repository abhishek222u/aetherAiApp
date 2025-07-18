import { View, Text, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native'
import React from 'react'
import { verificationStyles } from './Styles'
import Colors from '../../constants/colors'

const Verification = ({navigation}) => {
    return (
        <SafeAreaView style={verificationStyles.container}>
            <TouchableOpacity style={verificationStyles.backButton}>
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
                <TextInput maxLength={1}
                    keyboardType="numeric"
                    textAlign="center"
                    style={verificationStyles.codeBox}></TextInput>
                <TextInput maxLength={1}
                    keyboardType="numeric"
                    textAlign="center"
                    style={verificationStyles.codeBox}></TextInput>
                <TextInput maxLength={1}
                    keyboardType="numeric"
                    textAlign="center"
                    style={verificationStyles.codeBox}></TextInput>
                <TextInput maxLength={1}
                    keyboardType="numeric"
                    textAlign="center"
                    style={verificationStyles.codeBox}></TextInput>
            </View>
            <Text style={verificationStyles.timer}>00:36 <Text style={{ color: 'black' }}>Seconds</Text></Text>
            <TouchableOpacity style={verificationStyles.resendButton}>
                <Text style={verificationStyles.resendText}>Didn't receive the OTP? <Text style={{ color: Colors.greenColor }}>Resend</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity style={verificationStyles.verifyButton} onPress={() => navigation.navigate('PersonalDetail')}>
                <Text style={verificationStyles.verifyText}>Verify</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Verification