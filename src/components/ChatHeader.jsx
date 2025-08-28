import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {
    scale,
    verticalScale,
    moderateScale,
} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { loadModel, unloadModel } from '../lib/LocalApis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native'; // 👈 ScrollView import karo


const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

const ChatHeader = ({ onNewChat, onSessionChange, sessions, activeSessionId, setSessions, setSelectedModel, selectedModel }) => {
    const [sidebarVisible, setSidebarVisible] = React.useState(false);
    const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const navigation = useNavigation();  // ✅ navigation hook

    const models = ["GPT", "Local"];

    const handleSelect = async (model) => {
        console.log(model,'model');
        if (model == 'Local') {
            setSelectedModel('Local');
            const res = await loadModel();
            // console.log(res,'res');
            // if (res == 500) {
            //     Alert.alert("Local model is not working");
            // }
        } else {
            setSelectedModel(model);
            unloadModel();
        }
        setDropdownVisible(false);
    };

    const openSidebar = () => {
        setSidebarVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const closeSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: -SIDEBAR_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setSidebarVisible(false);
        });
    };

    const handleSessionSelect = (sessionId) => {
        if (onSessionChange) onSessionChange(sessionId);
        closeSidebar();
    };

    const handleNewChat = async () => {
        try {
            const response = await axios.post("http://74.225.157.233:3010/api/session");
            const newSessionId = response?.data?.session_id;
            if (onNewChat) onNewChat(newSessionId);
            closeSidebar();
        } catch (error) {
            console.error("Failed to create new chat:", error);
        }
    };

    const handleLogout = async () => {
        try {
            // ✅ clear user data / token
            await AsyncStorage.clear();

            closeSidebar();
            // // ✅ redirect to SignIn screen
            navigation.replace("LoginScreen");  // replace use karo taaki back button se wapas na aaye
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const renderSessionItem = ({ item }) => {
        const isActive = item.id === activeSessionId;
        return (
            <TouchableOpacity
                style={[styles.sidebarItem, isActive && styles.activeSession]}
                onPress={() => handleSessionSelect(item.id)}
            >
                <Text style={[styles.sidebarItemText, isActive && styles.activeSessionText]}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={openSidebar}>
                    <Icon name="menu" size={scale(24)} color="#4B5563" />
                </TouchableOpacity>
                <View style={styles.brand}>
                    <Image
                        source={require('../assets/images/Robotimage.png')}
                        style={styles.logo}
                    />
                    <View>
                        <Text style={styles.brandName}>Pharmakart AI</Text>
                        <Text style={styles.subtitle}>Your Medicine Assistant</Text>
                    </View>
                </View>
                <View style={{ position: "relative" }}>
                    <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                        <Entypo name="dots-three-vertical" size={20} color="#4B5563" />
                    </TouchableOpacity>

                    {dropdownVisible && (
                        <Modal transparent animationType="fade">
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => setDropdownVisible(false)}
                                activeOpacity={1}
                            >
                                <View style={[styles.dropdownMenu, { position: "absolute", top: 60, right: 20 }]}>
                                    {models.map((model, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.dropdownItem}
                                            onPress={() => handleSelect(model)}
                                        >
                                            <Text style={[
                                                styles.dropdownItemText,
                                                selectedModel === model && styles.selectedItem,
                                            ]}>
                                                {model}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    )}
                </View>
            </View>

            {sidebarVisible && (
                <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.sidebarContent}>

                        {/* 🔼 UPPER CONTENT WITH SCROLL */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            <View style={[styles.brand, { marginBottom: scale(20), display: 'flex', justifyContent: 'space-between' }]}>
                                <View>
                                    <Text style={styles.brandName}>Pharmakart AI</Text>
                                    <Text style={styles.subtitle}>Your Medicine Assistant</Text>
                                </View>
                                <TouchableOpacity onPress={closeSidebar}>
                                    <Entypo name="cross" size={24} color="#4B5563" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
                                <Icon name="plus" size={scale(20)} color="#fff" />
                                <Text style={styles.newChatButtonText}>New Chat</Text>
                            </TouchableOpacity>

                            <Text style={styles.sidebarTitle}>Chat History</Text>
                            {sessions.map((session) => (
                                <View key={session.id}>
                                    {renderSessionItem({ item: session })}
                                </View>
                            ))}
                        </ScrollView>

                        {/* 🔽 LOGOUT BUTTON FIXED AT BOTTOM */}
                        <View style={{ paddingVertical: 15 }}>
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Animated.View>
            )}

        </>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: moderateScale(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    brand: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: scale(40),
        height: scale(40),
        marginRight: scale(8),
    },
    brandName: {
        fontSize: scale(18),
        fontWeight: '600',
        color: '#000',
    },
    subtitle: {
        fontSize: scale(12),
        color: 'green',
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SIDEBAR_WIDTH,
        height: '100%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
    },
    sidebarContent: {
        flex: 1,
        padding: moderateScale(20),
        justifyContent: "space-between",
    },
    sidebarTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        marginVertical: verticalScale(8),
        color: 'black'
    },
    sidebarItem: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(10),
        borderRadius: scale(8),
        marginBottom: verticalScale(5),
    },
    sidebarItemText: {
        fontSize: scale(14),
        color: '#333',
    },
    activeSession: {
        backgroundColor: '#E6F9F1',
    },
    activeSessionText: {
        fontWeight: '600',
        color: '#31916E',
    },
    newChatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#31916E',
        borderRadius: scale(25),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(15),
        marginBottom: verticalScale(10),
    },
    newChatButtonText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '600',
        marginLeft: scale(8),
    },
    dropdownMenu: {
        position: "absolute",
        top: 30,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 6,
        elevation: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        width: 150,
        zIndex: 9999,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    dropdownItemText: {
        fontSize: 14,
        color: "#111827",
    },
    selectedItem: {
        fontWeight: "bold",
        color: "#31916E",
    },
    logoutButton: {
        backgroundColor: "#31916E", // red color
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 20,
    },
    logoutText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default ChatHeader;