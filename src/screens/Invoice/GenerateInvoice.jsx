import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Colors from '../../constants/colors';
import axios from 'axios';

const GenerateInvoice = ({ navigation }) => {
  const route = useRoute();
  const { query } = route.params;

  const [items, setItems] = useState([
    { name: '', quantity: '', price: '' }
  ]);

  // Add new medicine card
  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: '', price: '' }]);
  };

  // Update input values
  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return sum + qty * price;
  }, 0);

  const discount = subtotal * 0.25; // 25% discount
  const gst = (subtotal - discount) * 0.05;
  const total = subtotal - discount + gst;

  // API call
  const handleSendInvoice = async () => {
    try {
      const quotation = {
        items: items.map(item => ({
          name: item.name,
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 0,
        })),
        total: total.toFixed(2),
        currency: 'INR',
      };

      const body = {
        // request_id: 'e4fae93d-a67a-4d52-a396-4f4681b27c9d',
        request_id: query?.request_id,
        quotation,
      };

      // console.log(body, 'body')

      const response = await axios.post('http://74.225.157.233:9000/api/v1/agent/add-quotation', body, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      // console.log(response, 'response')
      const newData = response?.data?.data;

      Alert.alert('Success', 'Invoice sent successfully!');
      navigation.navigate('PaymentSuccessAgentScreen', { newData });

    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            style={{ marginRight: moderateScale(16) }}
            size={moderateScale(20)}
            color="#000"
          />
          <Text style={styles.title}>Generate Invoice</Text>
          <View style={styles.timer}>
            <Text style={styles.timerText}>02:00</Text>
          </View>
        </View>

        {/* Medicine Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicine Details</Text>
            <TouchableOpacity>
              <Text style={styles.addItem} onPress={handleAddItem}>+ Add Item</Text>
            </TouchableOpacity>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Medicine Name</Text>
                  <TextInput
                    placeholder="Name"
                    style={styles.input}
                    value={item.name}
                    onChangeText={(text) => handleChange(index, 'name', text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    placeholder="Quantity"
                    keyboardType="numeric"
                    style={styles.input}
                    value={item.quantity.toString()}
                    onChangeText={(text) => handleChange(index, 'quantity', text)}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>MRP per unit</Text>
                  <TextInput
                    placeholder="MRP"
                    keyboardType="numeric"
                    style={styles.input}
                    value={item.price.toString()}
                    onChangeText={(text) => handleChange(index, 'price', text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Total MRP</Text>
                  <TextInput
                    editable={false}
                    style={styles.input}
                    value={(item.quantity && item.price) ? (parseFloat(item.quantity) * parseFloat(item.price)).toString() : '0'}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Price Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text>Subtotal ({items.length} Items)</Text>
            <Text>₹ {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.discountText}>Discount (25% Off)</Text>
            <Text style={styles.discountText}>- ₹ {discount.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text>GST(5%)</Text>
            <Text>₹ {gst.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalText}>₹ {total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.totalText}>Total Amount: ₹ {total.toFixed(2)}</Text>
          <Text style={styles.lockIcon}>🔒 Pharmakart Protected</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSendInvoice}>
          <Text style={styles.buttonText}>Send Invoice</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>By proceeding, you agree to our Terms & Conditions</Text>
      </View>
    </SafeAreaView>
  );
};

export default GenerateInvoice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'UrbanistBlack',
  },
  scrollContent: {
    padding: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(23),
  },
  backArrow: {
    fontSize: scale(18),
  },
  title: {
    fontSize: scale(22),
    fontWeight: 'semibold',
  },
  timer: {
    backgroundColor: '#E9FAF2',
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderWidth: 1,
    borderColor: Colors.greenColor
  },
  timerText: {
    color: Colors.greenColor,
    fontWeight: '600',
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: 'SemiBold',
  },
  addItem: {
    color: Colors.greenColor,
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    padding: moderateScale(12),
    marginBottom: verticalScale(12),
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  inputGroup: {
    width: '48%',
  },
  label: {
    fontSize: scale(12),
    marginBottom: verticalScale(4),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(10),
    padding: moderateScale(8),
    fontSize: scale(12),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(6),
  },
  discountText: {
    color: '#31916E',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: verticalScale(8),
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: scale(14),
  },
  footer: {
    padding: moderateScale(16),
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  lockIcon: {
    fontSize: scale(12),
    color: '#555',
  },
  button: {
    backgroundColor: '#31916E',
    paddingVertical: verticalScale(12),
    borderRadius: scale(30),
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: scale(14),
  },
  termsText: {
    fontSize: scale(10),
    color: '#888',
    textAlign: 'center',
  },
});
