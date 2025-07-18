import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import Verification from '../screens/Login/Verification';
import PersonalDetailScreen from '../screens/PersonalDetail/PersonalDetailScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
// import HomeScreen from '../screens/HomeScreen';
// import DetailsScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
                <Stack.Screen name="Verification" options={{ headerShown: false }} component={Verification} />
                <Stack.Screen name="PersonalDetail" options={{ headerShown: false }} component={PersonalDetailScreen} />
                <Stack.Screen name="Chat" options={{ headerShown: false }} component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
