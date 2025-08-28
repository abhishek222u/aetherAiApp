import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Colors from '../../constants/colors';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const Offer = ({ navigation }) => {
  const route = useRoute();
  const { query } = route.params;
  const { userId } = useContext(UserContext);

  // form states
  const [responseText, setResponseText] = useState('');
  const [discount, setDiscount] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);

  // start countdown when page opens
  useEffect(() => {
    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // format time mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!responseText || !discount) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    try {
      const body = {
        request_id: query?.request_id,
        // agent_id: 'a8eebc99-9c0b-4ef8-bb6d-6bb9bd380a29',
        agent_id: userId,
        discount: discount,
        message: responseText,
      };

      const res = await axios.post('http://74.225.157.233:9000/api/v1/agent/update-request', body);

      if (res.status === 200) {
        Alert.alert('Success', 'Offer sent successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while sending offer');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              style={{ marginRight: moderateScale(16) }}
              size={moderateScale(20)}
              color="#000"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Send Offer</Text>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        {/* Full-width Divider */}
        <View style={styles.divider} />

        <ScrollView contentContainerStyle={styles.content}>
          {/* Request ID */}
          <Text style={styles.requestText}>New Request {query?.request_id}</Text>

          {/* Prescription Image */}
          <Image
            src={query?.image}
            style={styles.prescriptionImage}
          />
          <Text style={styles.prescriptionLabel}>Medicine prescription uploaded</Text>

          {/* Response Input */}
          <TextInput
            placeholder="Type your response to the consumer......"
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={responseText}
            onChangeText={setResponseText}
          />

          {/* Discount Input */}
          <Text style={styles.discountLabel}>Discount</Text>
          <View style={styles.discountInputWrapper}>
            <TextInput
              placeholder="Enter Discount"
              style={styles.discountInput}
              placeholderTextColor={'#6B7280'}
              keyboardType="numeric"
              value={discount}
              onChangeText={setDiscount}
            />
            <Text style={styles.percentSign}>%</Text>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Offer</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>🔒 Pharmakart Protected</Text>
      </View>
    </SafeAreaView>
  );
};

export default Offer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(19),
    paddingBottom: verticalScale(16),
  },
  title: {
    fontSize: scale(22),
    fontWeight: '600',
  },
  timer: {
    backgroundColor: '#E9FAF2',
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderWidth: 1,
    borderColor: Colors.greenColor,
  },
  timerText: {
    color: Colors.greenColor,
    fontWeight: '600',
    fontSize: scale(12),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  content: {
    padding: moderateScale(20),
    paddingBottom: verticalScale(80), // extra space for sticky button
  },
  requestText: {
    fontSize: scale(16),
    color: '#4B5563',
    marginVertical: verticalScale(12),
  },
  prescriptionImage: {
    width: '100%',
    height: verticalScale(150),
    borderRadius: scale(10),
    resizeMode: 'cover',
    borderWidth: 1,
  },
  prescriptionLabel: {
    fontSize: scale(12),
    marginVertical: verticalScale(16),
    color: '#666',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: scale(10),
    padding: moderateScale(40),
    textAlignVertical: 'top',
    fontSize: scale(12),
    marginBottom: verticalScale(16),
  },
  discountLabel: {
    fontSize: scale(14),
    marginBottom: verticalScale(10),
    color: '#6B7280',
  },
  discountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(7),
    marginBottom: verticalScale(24),
  },
  discountInput: {
    flex: 1,
    fontSize: scale(16),
    paddingVertical: verticalScale(8),
  },
  percentSign: {
    fontSize: scale(12),
    color: '#888',
    marginLeft: scale(4),
  },
  button: {
    backgroundColor: Colors.greenColor,
    paddingVertical: verticalScale(12),
    marginHorizontal: moderateScale(25),
    borderRadius: scale(30),
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scale(16),
  },
  footerText: {
    fontSize: scale(12),
    color: '#888',
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
});
