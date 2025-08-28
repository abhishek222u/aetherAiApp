import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export const verificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(20),
    fontFamily: 'UrbanistBlack',
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(40),
    left: moderateScale(20),
    padding: moderateScale(10),
  },
  title: {
    marginTop: moderateScale(111),
    fontSize: moderateScale(25),
    fontWeight: 'bold',
    color: Colors.greenColor,
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#898996',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: scale(300),
    marginBottom: verticalScale(12),
  },
  codeBox: {
    width: scale(60),
    height: verticalScale(60),
    color: Colors.blackColor,
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: moderateScale(20),
    backgroundColor: '#EBF4F1',
  },
  timer: {
    fontSize: moderateScale(14),
    color: '#31916E',
    marginBottom: verticalScale(10),
  },
  resendButton: {
    marginBottom: verticalScale(287),
  },
  resendText: {
    fontSize: moderateScale(14),
    color: Colors.grayColor,
  },
  verifyButton: {
    backgroundColor: Colors.greenColor,
    // paddingVertical: verticalScale(52),
    height: verticalScale(52),
    width: '100%',
    // paddingHorizontal: moderateScale(100),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'semibold',
  },
});
