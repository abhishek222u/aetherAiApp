import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Colors from '../../constants/colors';
import { useRoute } from '@react-navigation/native';

export default function PaymentSuccessScreen({ navigation }) {
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

  const discount = subtotal * 0.1;
  const gst = (subtotal - discount) * 0.05;
  const deliveryFee = 30;
  const total = subtotal - discount + gst + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      {/* Tick Icon */}
      <View style={styles.circle}>
        <Image
          source={require('../../assets/images/Tick.png')} // ✅ Replace with your tick icon path
          style={styles.checkIcon}
          resizeMode="contain"
        />
      </View>

      {/* Thank you text */}
      <Text style={styles.title}>Thankyou!</Text>
      <Text style={styles.subtitle}>Your payment has been processed successfully</Text>

      {/* Order Details */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>#MG2024001</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.greenText]}>Total Amount</Text>
          <Text style={[styles.value, styles.greenText]}>₹{total}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={[styles.value, { fontWeight: 700, }]}>UPI</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Chat')}>
        <Text style={styles.primaryBtnText}>Back to chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Chat')}>
        <Text style={styles.secondaryBtnText}>View Order Summary</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>🔒 Pharmakart Protected</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: scale(20),
    backgroundColor: '#fff',
    fontFamily: 'UrbanistBlack',
  },
  circle: {
    marginTop: verticalScale(30),
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: '#E3F4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    // width: scale(40),
    // height: scale(40),
  },
  title: {
    fontSize: scale(25),
    fontWeight: scale(700),
    color: '#2D2D2D',
    fontFamily: 'UrbanistBold',
    marginTop: verticalScale(20),
  },
  subtitle: {
    fontSize: scale(14),
    color: '#898996',
    marginTop: verticalScale(5),
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#F7F8FA',
    borderRadius: scale(12),
    padding: scale(15),
    marginTop: verticalScale(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  label: {
    color: '#4B5563',
    fontWeight: 500,
    fontSize: scale(15),
  },
  value: {
    color: '#1F2937',
    fontSize: scale(15),
  },
  greenText: {
    color: Colors.greenColor,
  },
  primaryBtn: {
    backgroundColor: Colors.greenColor,
    width: '100%',
    paddingVertical: verticalScale(12),
    borderRadius: scale(30),
    alignItems: 'center',
    marginTop: verticalScale(25),
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: 'semibold',
  },
  secondaryBtn: {
    borderColor: Colors.greenColor,
    borderWidth: 1,
    width: '100%',
    paddingVertical: verticalScale(12),
    borderRadius: scale(30),
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  secondaryBtnText: {
    color: Colors.greenColor,
    fontSize: scale(14),
    fontWeight: 'semibold',
  },
  footerText: {
    fontSize: scale(12),
    color: '#4B5563',
    marginTop: verticalScale(15),
  },
});
