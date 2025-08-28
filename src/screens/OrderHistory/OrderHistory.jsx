import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../constants/colors';

const orders = Array(6).fill({
    id: '#MG2024001',
    date: 'June 27, 2025',
    amount: '₹ 462',
});

const OrderHistory = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Icon name="arrow-left" size={moderateScale(20)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={{ width: scale(20) }} /> {/* Placeholder for alignment */}
            </View>

            {/* Order List */}
            <FlatList
                data={orders}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.orderId}>{item.id}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                            <Text style={styles.amount}>{item.amount}</Text>
                        </View>
                        <TouchableOpacity style={styles.invoiceButton}>
                            <Text style={styles.invoiceText}>View Invoice</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default OrderHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(16),
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    headerTitle: {
        fontSize: moderateScale(22),
        fontWeight: '600',
        color: '#373743',
    },
    listContainer: {
        paddingHorizontal: scale(16),
        paddingTop: scale(20),
        paddingBottom: verticalScale(20),
        backgroundColor: '#f9fafb'
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        marginVertical: verticalScale(6),
        alignItems: 'center',
    },
    orderId: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#1F2937',
    },
    date: {
        fontSize: moderateScale(12),
        color: '#4B5563',
        marginVertical: verticalScale(2),
    },
    amount: {
        fontSize: moderateScale(17),
        color: Colors.greenColor,
        fontWeight: '600',
        marginTop: verticalScale(4),
    },
    invoiceButton: {
        borderWidth: 1,
        borderColor: '#26a865',
        borderRadius: moderateScale(20),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
    },
    invoiceText: {
        color: Colors.greenColor,
        fontWeight: '500',
        fontSize: moderateScale(14),
    },
    backButton: {
        backgroundColor: Colors.greenColor,
        margin: scale(16),
        borderRadius: moderateScale(24),
        alignItems: 'center',
        paddingVertical: verticalScale(12),
    },
    backText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});
