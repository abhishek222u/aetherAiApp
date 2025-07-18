import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo';
import {
    scale,
    verticalScale,
    moderateScale,
} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

const ChatHeader = () => {
    return (
        <View style={styles.header}>
            <Icon name="menu" size={scale(24)} color="#4B5563" />
            <View style={styles.brand}>
                <Image
                    source={require('../assets/images/Robotimage.png')}
                    style={styles.logo}
                />
                <View>
                    <Text style={styles.brandName}>Pharmakart AI</Text>
                    <Text style={styles.subtitle}>Your Medicine Assistant</Text>
                </View>
            </View>
            <Entypo name="dots-three-vertical" size={20} color="#4B5563" />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: moderateScale(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brand: {
        flexDirection: 'row',
        // alignItems: 'center',
    },
    logo: {
        width: scale(40),
        height: scale(40),
        marginRight: scale(8),
    },
    brandName: {
        fontSize: scale(18),
        fontWeight: '600',
        color: '#000',
    },
    subtitle: {
        fontSize: scale(12),
        color: 'green',
    },
})

export default ChatHeader