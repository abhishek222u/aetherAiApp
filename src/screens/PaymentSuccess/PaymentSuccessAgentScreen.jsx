import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../constants/colors';
import { useRoute } from '@react-navigation/native';

const PaymentSuccessAgentScreen = ({ navigation }) => {
    const route = useRoute();
    const { newData } = route.params;

    let quotation = {};
    try {
        quotation = JSON.parse(newData?.quotation || '{}');
    } catch (e) {
        console.log('Error parsing quotation', e);
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Success Icon */}
            <View style={styles.circleWrapper}>
                <Image
                    source={require('../../assets/images/Tick.png')} // ✅ Replace with your tick icon path
                    style={styles.checkIcon}
                    resizeMode="contain"
                />
            </View>

            {/* Thank You Message */}
            <Text style={styles.thankYou}>Invoice Sent Successfully</Text>
            <Text style={styles.subText}>Your invoice has been delivered to the customer. They will receive a notification to proceed with payment.</Text>

            {/* Payment Info Card */}
            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <Text style={styles.label}>Order ID</Text>
                    <Text style={styles.orderId}>#MG2024001</Text>
                </View>
                <View style={styles.cardRow}>
                    <Text style={[styles.label, { color: Colors.greenColor }]}>Total Amount</Text>
                    <Text style={[styles.amountText, { color: Colors.greenColor }]}>{quotation?.currency === 'INR' ? '₹' : ''} {quotation?.total || 0}</Text>
                </View>
                <View style={styles.cardRow}>
                    <Text style={styles.label}>Payment Method</Text>
                    <View style={styles.paymentRow}>
                        <FontAwesome name="cc-mastercard" size={moderateScale(15)} color="#F44336" />
                        <Text style={styles.cardText}>CARD</Text>
                    </View>
                </View>
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.continueText}>Return to Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.viewInvoiceButton, { marginTop: verticalScale(12), backgroundColor: '#FFFFFF' }]}>
                    <Text style={styles.invoiceText}>View Invoice</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Icon name="lock" size={moderateScale(12)} color="#888" />
                <Text style={styles.footerText}>Pharmakart Protected</Text>
            </View>
        </SafeAreaView>
    );
};

export default PaymentSuccessAgentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        paddingHorizontal: scale(16),
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'UrbanistBlack',
    },
    circleWrapper: {
        backgroundColor: '#DFF4E7',
        borderRadius: 100,
        padding: scale(18),
        marginBottom: verticalScale(16),
    },
    circle: {
        backgroundColor: '#2E7D4F',
        padding: scale(20),
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thankYou: {
        fontSize: moderateScale(23),
        fontWeight: '700',
        color: '#373743',
        marginBottom: verticalScale(4),
    },
    subText: {
        fontSize: moderateScale(14),
        color: '#898996',
        textAlign: 'center',
        marginBottom: verticalScale(24),
    },
    card: {
        backgroundColor: '#F9FAFB',
        width: '100%',
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        marginBottom: verticalScale(24),
        elevation: 2,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(10),
        alignItems: 'center',
    },
    label: {
        fontSize: moderateScale(15),
        color: '#4B5563',
        fontWeight: '500',
    },
    orderId: {
        fontSize: moderateScale(15),
        color: '#1F2937',
        fontWeight: '600',
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardText: {
        fontSize: moderateScale(13),
        color: '#2c2c2c',
        fontWeight: '500',
        marginLeft: scale(6),
    },
    amountText: {
        fontSize: moderateScale(15),
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginBottom: verticalScale(24),
    },
    continueButton: {
        backgroundColor: Colors.greenColor,
        width: '100%',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(24),
        alignItems: 'center',
    },
    viewInvoiceButton: {
        backgroundColor: '#ffffff',
        width: '100%',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(24),
        alignItems: 'center',
        borderColor: '#31916E',
        borderWidth: 1
    },
    continueText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    invoiceText: {
        color: '#31916E',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(16),
        gap: scale(6),
    },
    footerText: {
        fontSize: moderateScale(12),
        color: '#4B5563',
    },
});
