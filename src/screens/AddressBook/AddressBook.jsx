import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Colors from '../../constants/colors';

const savedAddresses = [
    {
        type: 'Home',
        address: '1566 Galli No 1, 3B2 Mohali, Punjab 160059',
    },
    {
        type: 'Work',
        address: 'SM Heights, Mohali Punjab',
    },
    {
        type: 'Other',
        address: 'Meghna Complex Rohtak, Haryana',
    },
];

const AddressBook = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Icon name="arrow-left" size={moderateScale(20)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Address Book</Text>
                <View style={{ width: scale(20) }} />
            </View>

            {/* New Address Card */}
            <TouchableOpacity style={styles.newAddressCard}>
                <View style={styles.iconWithText}>
                    <MaterialIcons name="location-pin" size={moderateScale(22)} color="#3CB371" />
                    <View>
                        <Text style={styles.newAddressText}>Enter New Address</Text>
                        <Text style={styles.subText}>Add a new delivery location</Text>
                    </View>
                </View>
                <Icon name="chevron-right" size={moderateScale(20)} color="#000" />
            </TouchableOpacity>

            {/* Saved Address Title */}
            <Text style={styles.savedTitle}>Saved Address</Text>

            {/* Saved Addresses */}
            <FlatList
                data={savedAddresses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.addressCard}>
                        <View style={styles.iconWithText}>
                            <MaterialIcons name="home" size={moderateScale(22)} color="#3CB371" />
                            <View>
                                <Text style={styles.addressType}>{item.type}</Text>
                                <Text style={styles.addressDetail}>{item.address}</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={moderateScale(20)} color="#000" />
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: verticalScale(30) }}
            />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default AddressBook;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: moderateScale(16),
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#FFFFF'
    },
    headerTitle: {
        fontSize: moderateScale(22),
        fontWeight: '600',
        color: '#373743',
    },
    newAddressCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: scale(16),
        borderRadius: moderateScale(12),
        padding: moderateScale(14),
        marginTop: verticalScale(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#F3F4F6',
        borderWidth: 1
    },
    iconWithText: {
        flexDirection: 'row',
        gap: scale(10),
        alignItems: 'flex-start',
    },
    newAddressText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#2c2c2c',
    },
    subText: {
        fontSize: moderateScale(12),
        color: '#7c7c7c',
        marginTop: verticalScale(2),
    },
    savedTitle: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#2c2c2c',
        marginTop: verticalScale(16),
        marginBottom: verticalScale(4),
        marginLeft: scale(16),
    },
    addressCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: scale(16),
        borderRadius: moderateScale(12),
        padding: moderateScale(14),
        marginTop: verticalScale(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#F3F4F6',
        borderWidth: 1
    },
    addressType: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#2c2c2c',
    },
    addressDetail: {
        fontSize: moderateScale(12),
        color: '#7c7c7c',
        marginTop: verticalScale(2),
        width: scale(220),
    },
    backButton: {
        backgroundColor: Colors.greenColor,
        margin: scale(16),
        borderRadius: moderateScale(24),
        alignItems: 'center',
        paddingVertical: verticalScale(14),
    },
    backText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});
