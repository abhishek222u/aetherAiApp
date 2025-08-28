import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../../constants/colors';

const plans = [
    {
        title: 'Basic',
        price: 'FREE',
        period: '/7 Days',
        tagLine: 'Perfect for getting started',
        features: [
            { label: '5 Leads per day', active: true },
            { label: 'Basic chat support', active: true },
            { label: 'Invoice Generation', active: false },
            { label: 'Advanced Analysis', active: false },
        ],
        button: 'Start Free Trial',
        filled: false,
    },
    {
        title: 'Premium',
        price: '₹ 5000',
        period: '/month',
        tagLine: 'For established business',
        features: [
            { label: 'Unlimited Leads', active: true },
            { label: 'Priority chat support', active: true },
            { label: 'Invoice Generation', active: true },
            { label: 'Advanced Analysis', active: true },
        ],
        button: 'Choose Plan',
        filled: true,
    },
    {
        title: 'PRO',
        price: '₹ 3000',
        period: '/month',
        tagLine: 'Best for growing agents',
        features: [
            { label: '20 Leads per day', active: true },
            { label: 'Priority chat support', active: true },
            { label: 'Invoice Generation', active: true },
            { label: 'Advanced Analysis', active: false },
        ],
        button: 'Choose Plan',
        filled: false,
    },
];

const PlanCard = ({ item, navigation }) => (
    <View
        style={[
            styles.card,
            item.filled && { backgroundColor: '#E6F5EC', borderWidth: 0 },
        ]}
    >
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardPrice}>
                {item.price} <Text style={styles.cardPeriod}>{item.period}</Text>
            </Text>
        </View>

        <Text style={styles.cardLine}>{item.tagLine}</Text>
        {item.features.map((feature, index) => (
            <View style={styles.featureRow} key={index}>
                <Entypo
                    name={feature.active ? 'check' : 'cross'}
                    size={moderateScale(16)}
                    color={feature.active ? Colors.greenColor : '#ccc'}
                    style={{ marginRight: scale(8) }}
                />
                <Text
                    style={[
                        styles.featureText,
                        !feature.active && { color: '#ccc', textDecorationLine: 'line-through' },
                    ]}
                >
                    {feature.label}
                </Text>
            </View>
        ))}

        <TouchableOpacity
            onPress={() => navigation.navigate('Dashboard')}
            style={[
                styles.planButton,
                item.filled
                    ? { backgroundColor: Colors.greenColor }
                    : { borderWidth: 1, borderColor: Colors.greenColor },
            ]}
        >
            <Text
                style={[
                    styles.planButtonText,
                    item.filled ? { color: '#fff' } : { color: Colors.greenColor },
                ]}
            >
                {item.button}
            </Text>
        </TouchableOpacity>
    </View>
);

const UpgradePlan = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Header */}
                <Text style={styles.badge}>
                    <Text style={styles.badgeText}>★ CHOOSE PLAN ★</Text>
                </Text>

                <Text style={styles.heading}>Upgrade to PharmaKart+</Text>
                <Text style={styles.subheading}>Powered by <Text style={{ fontWeight: '600', color: Colors.greenColor }}>Aether AI</Text></Text>

                {/* Plans */}
                {plans.map((plan, idx) => (
                    <PlanCard item={plan} key={idx} navigation={navigation} />
                ))}

                {/* Continue Button */}
                <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.continueText}>Continue with premium plan</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footer}>
                    <Entypo name="lock" size={moderateScale(14)} color="#888" />
                    <Text style={styles.footerText}>Pharmakart Protected</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UpgradePlan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        fontFamily: 'UrbanistBlack',
    },
    scroll: {
        padding: scale(16),
        paddingBottom: verticalScale(60),
        marginTop: scale(50)
    },
    badge: {
        alignSelf: 'center',
        backgroundColor: Colors.greenColor,
        paddingVertical: verticalScale(4),
        paddingHorizontal: scale(12),
        borderRadius: moderateScale(20),
        marginBottom: verticalScale(10),
    },
    badgeText: {
        fontSize: moderateScale(11),
        color: '#ffffff',
        fontWeight: '600',
    },
    heading: {
        fontSize: moderateScale(20),
        fontWeight: '500',
        textAlign: 'center',
        color: '#373743',
        marginBottom: verticalScale(4),
    },
    subheading: {
        fontSize: moderateScale(14),
        textAlign: 'center',
        color: '#666',
        marginBottom: verticalScale(20),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        marginBottom: verticalScale(16),
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: Colors.greenColor,
    },
    cardPrice: {
        fontSize: scale(18),
        fontWeight: '600',
        color: Colors.greenColor,
    },
    cardPeriod: {
        fontSize: moderateScale(10),
        fontWeight: '600',
        color: '#6B7280',
    },
    cardLine: {
        marginBottom: verticalScale(10),
        color: '#374151',
        fontSize: scale(12),
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(6),
    },
    featureText: {
        fontSize: moderateScale(13),
        color: Colors.greenColor,
        fontWeight: '600'

    },
    planButton: {
        marginTop: verticalScale(12),
        borderRadius: moderateScale(24),
        paddingVertical: verticalScale(10),
        alignItems: 'center',
    },
    planButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    continueButton: {
        backgroundColor: Colors.greenColor,
        borderRadius: moderateScale(24),
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        marginTop: verticalScale(12),
    },
    continueText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    footer: {
        marginTop: verticalScale(20),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(6),
    },
    footerText: {
        fontSize: moderateScale(11),
        color: '#888',
    },
});
