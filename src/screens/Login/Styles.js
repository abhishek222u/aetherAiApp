import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'UrbanistBlack',
  },
  headerImage: {
    width: '100%',
    height: moderateScale(330),
  },
  headerText: {
    fontSize: scale(25),
    textAlign: 'center',
    fontFamily: 'UrbanistSemiBold',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: moderateScale(1),
    justifyContent: 'center',
    marginTop: verticalScale(5),
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateVerticalScale(2),
    paddingHorizontal: moderateScale(20),
  },
  tabText: {
    fontSize: scale(16),
    padding: moderateScale(10),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 16,
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(25),
    marginHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
  },
  agentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 16,
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(25),
    marginHorizontal: moderateScale(17),
    paddingVertical: moderateScale(8),
  },
  inputText: {
    marginTop: moderateScale(12),
    marginHorizontal: moderateScale(17),
    color: '#6B7280',
  },
  countryCode: {
    marginRight: moderateScale(10),
    // fontSize: width * 0.045,
  },
  input: {
    flex: 1,
    color: '#000',
  },
  otpButton: {
    marginTop: moderateScale(10),
    backgroundColor: '#27AE60',
    borderRadius: 24,
    alignItems: 'center',
    paddingHorizontal: moderateScale(25),
    marginHorizontal: moderateScale(15),
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: scale(14),
    textAlign: 'center',
    marginTop: moderateScale(4),
  },
  otpText: {
    color: '#fff',
    fontSize: scale(18),
    textAlign: 'center',
  },
  poweredBy: {
    textAlign: 'center',
    marginTop: moderateScale(100),
    color: '#808080',
    fontSize: scale(14),
  },
  footerImageView: {
    marginTop: moderateScale(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerImage: {
    height: moderateScale(32),
    width: moderateVerticalScale(109),
  },
});

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
    fontWeight: 'bold',
  },
});
