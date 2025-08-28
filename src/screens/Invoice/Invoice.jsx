import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    scale,
    verticalScale,
    moderateScale,
} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import { useRoute } from '@react-navigation/native';

// const medicines = [
//     {
//         name: 'Paracetamol 500mg',
//         price: 45,
//         qty: 2,
//         desc: 'Strip of 10 tablets',
//         color: '#E6F0FD',
//         icon: '👤',
//     },
//     {
//         name: 'Amoxicillin 250mg',
//         price: 120,
//         qty: 2,
//         desc: 'Strip of 10 capsules',
//         color: '#F3E8FD',
//         icon: '👤',
//     },
//     {
//         name: 'Vitamin D3',
//         price: 120,
//         qty: 2,
//         desc: 'Strip of 10 capsules',
//         color: '#FFEFE3',
//         icon: '👤',
//     },
// ];

export default function Invoice({ navigation }) {
    const route = useRoute();
    const { InvoiceData } = route.params;
    const medicines = InvoiceData?.quotation?.items.map((item, index) => ({
        name: item.name,
        price: item.price,
        qty: item.quantity,
        desc: `Quantity: ${item.quantity}`, // description bana diya
        color: ['#E6F0FD', '#F3E8FD', '#FFEFE3'][index % 3], // random colors cycle
        icon: '💊',
    })) || [];

    const subtotal = medicines.reduce((acc, item) => acc + item.price * item.qty, 0);

    const discount = subtotal * 0.1; // Example: 10% discount
    const gst = (subtotal - discount) * 0.05; // 5% GST
    const deliveryFee = 30;
    const total = subtotal - discount + gst + deliveryFee;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Ionicons
                        name="arrow-back"
                        style={{ marginRight: moderateScale(16) }}
                        size={moderateScale(20)}
                        color="#000"
                    />
                    <View>
                        <Text style={styles.headerTitle}>Invoice</Text>
                        <Text style={styles.orderText}>Order #MG2024001</Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Medicine Details */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Medicine Details</Text>
                        {medicines.map((item, index) => (
                            <View key={index} style={styles.medicineRow}>
                                <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                                    <Text style={styles.iconText}>{item.icon}</Text>
                                </View>
                                <View style={styles.medicineInfo}>
                                    <Text style={styles.medName}>{item.name}</Text>
                                    <Text style={styles.medDesc}>{item.name}</Text>
                                </View>
                                <View style={styles.priceInfo}>
                                    <Text style={styles.priceText}>₹ {item.price}</Text>
                                    <Text style={styles.qtyText}>Qty: {item.quantity}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Price Details */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Price Details</Text>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Subtotal ({medicines.length} Items)</Text>
                            <Text style={styles.priceValue}>₹ {subtotal.toFixed(2)}</Text>
                        </View>

                        <View style={styles.priceRow}>
                            <Text style={[styles.priceLabel, styles.discountLabel]}>
                                Discount (10% Off)
                            </Text>
                            <Text style={[styles.priceValue, styles.discountValue]}>
                                - ₹ {discount.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>GST (5%)</Text>
                            <Text style={styles.priceValue}>₹ {gst.toFixed(2)}</Text>
                        </View>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Delivery Fee</Text>
                            <Text style={styles.priceValue}>₹ {deliveryFee}</Text>
                        </View>

                        <View style={[styles.priceRow, { marginTop: verticalScale(10) }]}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>₹ {total.toFixed(2)}</Text>
                        </View>

                        <Text style={styles.saveText}>
                            You saved ₹ {discount.toFixed(2)}
                        </Text>
                    </View>

                    {/* Footer Total & Button */}
                    <View style={styles.footerWrapper}>
                        <View style={styles.footerTop}>
                            <Text style={styles.footerTotal}>Total Amount: ₹ {total.toFixed(2)}</Text>
                            <Text style={styles.secureIcon}>🔒 Pharmakart Protected</Text>
                        </View>

                        <TouchableOpacity style={styles.payBtn} onPress={() => navigation.navigate('PaymentSuccessScreen', { InvoiceData })}>
                            <Text style={styles.payBtnText}>Pay Now Securely</Text>
                        </TouchableOpacity>

                        <Text style={styles.termsText}>
                            By proceeding, you agree to our Terms & Conditions
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'UrbanistBlack',
    },
    scrollContent: {
        flexGrow: 1,
        padding: scale(16),
        paddingBottom: verticalScale(40),
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderColor: '#f2f2f2',
    },
    headerTitle: {
        fontSize: scale(18),
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'UrbanistSemiBold',
    },
    orderText: {
        fontSize: moderateScale(12),
        color: '#1F2937',
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        marginBottom: verticalScale(10),
        fontFamily: 'UrbanistSemiBold',
        color: '#1F2937',
    },
    card: {
        backgroundColor: '#fff',
        padding: scale(16),
        borderRadius: scale(12),
        marginBottom: verticalScale(16),
        borderWidth: 1,
        borderColor: '#f2f2f2',
    },
    medicineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    iconBox: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: moderateScale(16),
    },
    medicineInfo: {
        flex: 1,
        marginLeft: scale(12),
    },
    medName: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#1F2937',
    },
    medDesc: {
        fontSize: moderateScale(12),
        color: '#4B5563',
    },
    priceInfo: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#1F2937',
    },
    qtyText: {
        fontSize: moderateScale(11),
        color: '#4B5563',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(6),
    },
    priceLabel: {
        fontSize: moderateScale(15),
        color: '#333',
    },
    priceValue: {
        fontSize: moderateScale(15),
        color: '#1F2937',
    },
    discountLabel: {
        color: Colors.greenColor,
    },
    discountValue: {
        color: Colors.greenColor,
    },
    totalLabel: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'UrbanistSemiBold',
    },
    totalValue: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'UrbanistSemiBold',
    },
    saveText: {
        fontSize: moderateScale(15),
        color: Colors.greenColor,
        marginTop: verticalScale(4),
        textAlign: 'right',
    },
    footerWrapper: {
        marginTop: verticalScale(10),
        alignItems: 'center',
    },
    footerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(10),
    },
    footerTotal: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: '#1F2937',
        fontFamily: 'UrbanistSemiBold',
    },
    secureIcon: {
        fontSize: moderateScale(12),
        color: '#4B5563',
    },
    payBtn: {
        backgroundColor: Colors.greenColor,
        width: '100%',
        borderRadius: scale(30),
        paddingVertical: verticalScale(14),
        alignItems: 'center',
        marginTop: verticalScale(6),
    },
    payBtnText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '600',
    },
    termsText: {
        fontSize: scale(12),
        color: '#4B5563',
        textAlign: 'center',
        marginTop: verticalScale(8),
    },
});
