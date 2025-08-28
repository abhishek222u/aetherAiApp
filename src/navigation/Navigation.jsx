import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import Verification from '../screens/Login/Verification';
import PersonalDetailScreen from '../screens/PersonalDetail/PersonalDetailScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import LocationAccess from '../screens/LocationAccess/LocationAccess';
import MapScreen from '../screens/Map/MapScreen';
import AddNewAddress from '../screens/NewAddress/NewAddress';
import UpgradePlan from '../screens/UpgradePlan/UpgradePlan';
import DashboardTabs from '../screens/Dashboard/Dashboard';
import Offer from '../screens/Offer/Offer';
import GenerateInvoice from '../screens/Invoice/GenerateInvoice';
import Invoice from '../screens/Invoice/Invoice';
import PaymentSuccessAgentScreen from '../screens/PaymentSuccess/PaymentSuccessAgentScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccess/PaymentSuccessScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator initialRouteName="Chat">
            <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="Verification" options={{ headerShown: false }} component={Verification} />
            <Stack.Screen name="PersonalDetail" options={{ headerShown: false }} component={PersonalDetailScreen} />
            <Stack.Screen name="Chat" options={{ headerShown: false }} component={ChatScreen} />
            <Stack.Screen name="LocationAccess" options={{ headerShown: false }} component={LocationAccess} />
            <Stack.Screen name="MapScreen" options={{ headerShown: false }} component={MapScreen} />
            <Stack.Screen name="AddNewAddress" options={{ headerShown: false }} component={AddNewAddress} />
            <Stack.Screen name="UpgradePlan" options={{ headerShown: false }} component={UpgradePlan} />
            <Stack.Screen name="Dashboard" options={{ headerShown: false }} component={DashboardTabs} />
            <Stack.Screen name="Offer" options={{ headerShown: false }} component={Offer} />
            <Stack.Screen name="GenerateInvoice" options={{ headerShown: false }} component={GenerateInvoice} />
            <Stack.Screen name="Invoice" options={{ headerShown: false }} component={Invoice} />
            <Stack.Screen name="PaymentSuccessAgentScreen" options={{ headerShown: false }} component={PaymentSuccessAgentScreen} />
            <Stack.Screen name="PaymentSuccessScreen" options={{ headerShown: false }} component={PaymentSuccessScreen} />
        </Stack.Navigator>
    );
}
