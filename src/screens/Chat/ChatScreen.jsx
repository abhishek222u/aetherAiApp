import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Icon from 'react-native-vector-icons/Feather';
import {
    scale,
    verticalScale,
    moderateScale,
} from 'react-native-size-matters';
import ChatHeader from '../../components/ChatHeader';
import Colors from '../../constants/colors';
import OfferModal from '../../components/OfferModal';
import axiosInstance from '../../lib/axiosInstance';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import { PermissionsAndroid } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { createContext, getContext, sendChatMessage } from '../../lib/LocalApis';

const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Camera Permission",
                message: "App needs access to your camera",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const ChatScreen = ({ navigation }) => {
    const initialMessages = [
        {
            id: '1',
            text: "Hi! I'm MediBot. Upload your prescription and I’ll help you find the best pharmacy deals.",
            type: 'bot',
            time: '10:30 AM',
        },
    ];

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(initialMessages);
    const [sessions, setSessions] = useState([
        { id: '1', title: 'Chat 1', messages: initialMessages },
    ]);

    // Save sessions to AsyncStorage whenever they change
    useEffect(() => {
        const saveSessions = async () => {
            try {
                await AsyncStorage.setItem('chatSessions', JSON.stringify(sessions));
            } catch (error) {
                console.error('Error saving sessions to AsyncStorage:', error);
            }
        };
        saveSessions();
    }, [sessions]);

    // Load sessions from AsyncStorage on mount
    useEffect(() => {
        const loadSessions = async () => {
            try {
                const storedSessions = await AsyncStorage.getItem('chatSessions');
                if (storedSessions) {
                    setSessions(JSON.parse(storedSessions));
                } else {
                    // Fetch from API if no local sessions exist
                    const response = await axios.get("http://74.225.157.233:3010/api/sessions");
                    const data = await response.data?.active_sessions || '';
                    const formattedSessions = data.map((session, index) => ({
                        id: session?.session_id,
                        title: 'Chat ' + (index + 1),
                        messages: initialMessages,
                    }));
                    setSessions(formattedSessions);
                }
            } catch (error) {
                console.error("Error loading sessions:", error);
                // Fallback to API fetch on error
                const response = await axios.get("http://74.225.157.233:3010/api/sessions");
                const data = await response.data?.active_sessions || '';
                const formattedSessions = data.map((session, index) => ({
                    id: session?.session_id,
                    title: 'Chat ' + (index + 1),
                    messages: initialMessages,
                }));
                setSessions(formattedSessions);
            }
        };
        loadSessions();
    }, []);

    const [activeSessionId, setActiveSessionId] = useState('1');
    const flatListRef = useRef(null);
    const modalizeRef = useRef(null);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedModel, setSelectedModel] = useState("GPT");
    const [isTyping, setIsTyping] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [uploadeddocument, setUploadeddocument] = useState(null);
    const [requestId, setRequestId] = useState(null);
    const { userId } = useContext(UserContext);

    // console.log(userId, 'userId');

    const quickActions = [
        'Use and side effects',
        'Diagnosis and symptoms',
        'Medications prescribed',
        'Additional instructions and recommendations',
    ];
    // console.log(selectedAddress, 'selectedAddress');

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }, 100);
        });

        return () => {
            showSubscription.remove();
        };
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isTyping]);

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleActionPress = async (text) => {
        if (!text.trim()) return;
        Keyboard.dismiss();
        setShowQuickActions(false);

        const userMsg = {
            id: Date.now().toString(),
            text,
            type: 'user',
            time: getCurrentTime(),
        };

        setMessages(prevMessages => [...prevMessages, userMsg]);

        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === activeSessionId
                    ? { ...session, messages: [...session.messages, userMsg] }
                    : session
            )
        );
        setInput('');
        setIsTyping(true);

        try {
            let data;
            if (selectedModel == 'GPT') {

                const response = await axiosInstance.post('/chat', { message: text }, {
                    headers: {
                        'X-Session-ID': activeSessionId,
                        'Content-Type': 'application/json',
                    },
                });
                data = await response.data;
            } else {
                const response = createContext();
                const getResponse = getContext(response?.data?.id);
                const sendChatMessageText = sendChatMessage(response?.data?.id, text);
                data = { response: sendChatMessageText };
            }

            const botReplyText = data?.response || "Sorry, no response from server.";

            const botReply = {
                id: (Date.now() + 1).toString(),
                text: botReplyText,
                type: 'bot',
                time: getCurrentTime(),
            };

            setMessages(prevMessages => {
                const newMessages = [...prevMessages, botReply];
                setSessions(prevSessions =>
                    prevSessions.map(session =>
                        session.id === activeSessionId
                            ? { ...session, messages: newMessages }
                            : session
                    )
                );
                return newMessages;
            });

        } catch (error) {
            console.error("API call failed:", error);
            const errorMsg = {
                id: (Date.now() + 2).toString(),
                text: "Oops! Something went wrong. Please try again.",
                type: 'bot',
                time: getCurrentTime(),
            };
            setMessages(prevMessages => [...prevMessages, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleDocPress = async (text) => {
        setShowQuickActions(false);

        const userMsg = {
            id: Date.now().toString(),
            text,
            imageUri: selectedImage.path,
            type: 'user',
            time: getCurrentTime(),
        };

        setMessages(prevMessages => [...prevMessages, userMsg]);

        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === activeSessionId
                    ? { ...session, messages: [...session.messages, userMsg] }
                    : session
            )
        );
        setInput('');
        setIsTyping(true);

        try {
            const formData2 = new FormData();
            formData2.append('prescription_file', {
                uri: selectedImage.path,
                type: selectedImage.mime,
                name: selectedImage.path.split('/').pop(),
            });
            formData2.append('username', '');
            formData2.append('user_email', '');

            const UploadDocument = await axios.post('http://74.225.157.233:5000/upload-prescription', formData2, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadeddocument(UploadDocument?.data?.blob_url);
        } catch (e) {
            console.log(e, 'error');
        }

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: selectedImage.path,
                type: selectedImage.mime,
                name: selectedImage.path.split('/').pop(),
            });

            formData.append('prompt_type', text);
            const response = await axiosInstance.post('/upload', formData, {
                headers: {
                    'X-Session-ID': activeSessionId,
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = await response.data;
            const botReplyText = data?.analysis || "Sorry, no response from server.";

            const botReply = {
                id: (Date.now() + 1).toString(),
                text: botReplyText,
                type: 'bot',
                time: getCurrentTime(),
            };

            setMessages(prevMessages => {
                const newMessages = [...prevMessages, botReply];
                setSessions(prevSessions =>
                    prevSessions.map(session =>
                        session.id === activeSessionId
                            ? { ...session, messages: newMessages }
                            : session
                    )
                );
                return newMessages;
            });

            if (response?.data?.medicines && response.data.medicines.length > 0) {
                const orderMsg = {
                    id: (Date.now() + 3).toString(),
                    type: 'order',
                    time: getCurrentTime(),
                };

                setMessages(prevMessages => {
                    const newMessages = [...prevMessages, orderMsg];
                    setSessions(prevSessions =>
                        prevSessions.map(session =>
                            session.id === activeSessionId
                                ? { ...session, messages: newMessages }
                                : session
                        )
                    );
                    return newMessages;
                });
            }

            setSelectedImage(null);

        } catch (error) {
            console.error("API call failed:", error);
            const errorMsg = {
                id: (Date.now() + 2).toString(),
                text: "Oops! Something went wrong. Please try again.",
                type: 'bot',
                time: getCurrentTime(),
            };
            setMessages(prevMessages => [...prevMessages, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleBookAction = (action) => {
        openOfferModal(action);
    };

    const handleAgentBookAction = async (action) => {
        if (action === 'ConfirmYes') {
            setIsTyping(true);
            try {
                const body = {
                    // 'address_id': '23f523ae-e942-4ed3-bf15-2c9ab36d1f74',
                    'address_id': selectedAddress?.address_id,
                    'document_link': uploadeddocument
                };
                const agentResponse = await axios.post('http://74.225.157.233:8000/api/v1/search/agents/progressive-with-document', body, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                setRequestId(agentResponse?.data?.external_api_response?.response_data?.data?.request_id)

                // console.log(agentResponse?.data?.external_api_response?.response_data?.data?.request_id, 'agentResponse');

                const botReply = {
                    id: Date.now().toString(),
                    text: JSON.stringify(agentResponse?.data?.message) || "Best deals found successfully!",
                    type: 'bot',
                    time: getCurrentTime(),
                };

                setMessages(prevMessages => {
                    const newMessages = [...prevMessages, botReply];
                    setSessions(prevSessions =>
                        prevSessions.map(session =>
                            session.id === activeSessionId
                                ? { ...session, messages: newMessages }
                                : session
                        )
                    );
                    return newMessages;
                });

                const loadingMsgId = Date.now().toString();
                const loadingMsg = {
                    id: loadingMsgId,
                    text: "Finding best deals for you...",
                    type: 'bot',
                    time: getCurrentTime(),
                };

                setMessages(prevMessages => {
                    const newMessages = [...prevMessages, loadingMsg];
                    setSessions(prevSessions =>
                        prevSessions.map(session =>
                            session.id === activeSessionId
                                ? { ...session, messages: newMessages }
                                : session
                        )
                    );
                    return newMessages;
                });

                const intervalId = setInterval(async () => {
                    try {
                        const discountResponse = await axios.get(
                            // 'http://74.225.157.233:6969/api/user-requests/476d578c-ccee-4c62-80dd-d4b5bc5007e5',
                            'http://74.225.157.233:6969/api/user-requests/' + agentResponse?.data?.external_api_response?.response_data?.data?.request_id,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            }
                        );

                        // console.log(discountResponse,'discountResponse')

                        if (discountResponse?.data?.data?.selected_agent_ids) {
                            clearInterval(intervalId);

                            const selectedAgents = JSON.parse(discountResponse.data.data.selected_agent_ids);

                            selectedAgents.forEach(agent => {
                                const offerMsg = {
                                    id: Date.now().toString(),
                                    type: 'offer',
                                    time: getCurrentTime(),
                                    text: agent.message || "Special offer available!",
                                    offer: {
                                        discount: `Flat ${agent.discount}% off`,
                                        price: agent?.price ? `₹${agent?.price}` : '',
                                        delivery: agent.distance
                                            ? `Delivery within ${Math.ceil(agent.distance)} km`
                                            : "Fast delivery",
                                    },
                                };

                                setMessages(prevMessages => {
                                    const newMessages = [...prevMessages, offerMsg];
                                    setSessions(prevSessions =>
                                        prevSessions.map(session =>
                                            session.id === activeSessionId
                                                ? { ...session, messages: newMessages }
                                                : session
                                        )
                                    );
                                    return newMessages;
                                });
                            });
                        }
                    } catch (err) {
                        console.log("Error fetching discount: ", err);
                    }
                }, 3 * 1000);
            } catch (e) {
                console.log("Could Not find best Deals: ", e);
                const errorMsg = {
                    id: Date.now().toString(),
                    text: "Could not find best deals. Please try again.",
                    type: 'bot',
                    time: getCurrentTime(),
                };
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages, errorMsg];
                    setSessions(prevSessions =>
                        prevSessions.map(session =>
                            session.id === activeSessionId
                                ? { ...session, messages: newMessages }
                                : session
                        )
                    );
                    return newMessages;
                });
            }
            finally {
                setIsTyping(false);
            }
        } else if (action === 'ConfirmNo') {
            const noMsg = {
                id: Date.now().toString(),
                type: 'bot',
                text: "Okay, let me know if you change your mind.",
                time: getCurrentTime(),
            };

            setMessages(prevMessages => {
                const newMessages = [...prevMessages, noMsg];
                setSessions(prevSessions =>
                    prevSessions.map(session =>
                        session.id === activeSessionId
                            ? { ...session, messages: newMessages }
                            : session
                    )
                );
                return newMessages;
            });
            setIsTyping(false);
        }
    };

    const openOfferModal = (offer) => {
        setSelectedOffer(offer);
        setIsModalVisible(true);

        setTimeout(() => {
            if (modalizeRef.current) {
                modalizeRef.current.open();
            }
        }, 50);
    };

    const closeOfferModal = () => {
        setIsModalVisible(false);
    };

    const resetChat = (getnewSessionId = null) => {
        const newId = getnewSessionId || (sessions.length + 1).toString();
        const newSession = {
            id: newId,
            title: `Chat ${sessions.length + 1}`,
            messages: initialMessages,
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newId);
        setMessages(initialMessages);
        setShowQuickActions(true);
    };

    const handleSessionChange = (sessionId) => {
        const selectedSession = sessions.find((session) => session.id === sessionId);
        if (selectedSession) {
            setActiveSessionId(sessionId);
            setMessages(selectedSession.messages || initialMessages);
            setShowQuickActions(selectedSession.messages.length === initialMessages.length);
        }
    };

    const acceptOfferOfAgent = async (offer) => {
        console.log(offer, 'offer')
        try {
            const body = {
                "request_id": requestId,
                // "request_id": "e4fae93d-a67a-4d52-a396-4f4681b27c9d",
                // "agent_id": "d73f10d5-260d-47f0-a644-1d8452b92427"
                "agent_id": offer?.id
            };
            const agentResponse = await axios.post('http://74.225.157.233:9000/api/v1/user/assign-agent', body, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (agentResponse?.status === 200) {
                const quotationMsg = {
                    id: Date.now().toString(),
                    type: 'bot',
                    text: "Getting Quotation ready for you...",
                    time: getCurrentTime(),
                };

                setMessages(prevMessages => {
                    const newMessages = [...prevMessages, quotationMsg];
                    setSessions(prevSessions =>
                        prevSessions.map(session =>
                            session.id === activeSessionId
                                ? { ...session, messages: newMessages }
                                : session
                        )
                    );
                    return newMessages;
                });

                const intervalId = setInterval(async () => {
                    try {
                        const quotationRes = await axios.get(
                            // "http://74.225.157.233:6969/api/user-requests/e4fae93d-a67a-4d52-a396-4f4681b27c9d/quotation"
                            "http://74.225.157.233:6969/api/user-requests/" + requestId + "/quotation"
                        );

                        if (quotationRes?.data) {
                            clearInterval(intervalId);
                            const InvoiceData = quotationRes?.data?.data;
                            navigation.navigate('Invoice', { InvoiceData });
                        }
                    } catch (err) {
                        console.log("Polling error:", err.message);
                    }
                }, 3000);
            }
        } catch (e) {
            console.log(e, 'error');
        }
    };

    const renderItem = ({ item }) => {
        if (item.type === 'offer') {
            return (
                <View style={styles.messageWrapper} >
                    <View style={[styles.messageBubble, styles.botBubble]}>
                        <Text style={styles.messageText}> {item.text} </Text>
                        <View style={styles.offerCard} >
                            <View style={styles.offerRow}>
                                <Text style={styles.offerDiscount}> {item.offer.discount} </Text>
                                <Text style={styles.offerPrice}> {item.offer.price} </Text>
                            </View>
                            <View style={styles.offerDeliveryRow} >
                                <Icon name="truck" size={scale(12)} color="#31916E" />
                                <Text style={styles.offerDeliveryText}> {item.offer.delivery} </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.offerButton}
                            onPress={() => acceptOfferOfAgent(item.offer)}
                        >
                            <Text style={styles.offerButtonText}> Select This Offer </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.messageTime, styles.botTime]} > {item.time} </Text>
                </View>
            );
        }
        if (item.type === 'order') {
            return (
                <View style={styles.messageWrapper} >
                    <View style={[styles.messageBubble, styles.botBubble]}>
                        <Text style={styles.messageText}> Do you want to buy these medicines? </Text>

                        <View style={styles.buttonRow} >
                            <TouchableOpacity style={styles.yesButton} onPress={() => handleBookAction('Yes')}>
                                <Text style={styles.yesButtonText}> Yes </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.noButton} onPress={() => handleBookAction('No')}>
                                <Text style={styles.noButtonText}> No </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={[styles.messageTime, styles.botTime]} > {item.time} </Text>
                </View>
            );
        }
        if (item.type === 'locationConfirm') {
            return (
                <View style={styles.messageWrapper}>
                    <View style={[styles.messageBubble, styles.botBubble]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.yesButton}
                                onPress={() => handleAgentBookAction('ConfirmYes')}
                            >
                                <Text style={styles.yesButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.noButton}
                                onPress={() => handleAgentBookAction('ConfirmNo')}
                            >
                                <Text style={styles.noButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.messageTime, styles.botTime]}>{item.time}</Text>
                </View>
            );
        }
        return (
            <View style={styles.messageWrapper} >
                <View
                    style={
                        [
                            styles.messageBubble,
                            item.type === 'user' ? styles.userBubble : styles.botBubble
                        ]
                    }
                >
                    {item.imageUri && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.imageUri }}
                                style={styles.chatImage}
                            />
                        </View>
                    )}
                    <Text style={styles.messageText}> {item.text} </Text>
                </View>
                <Text
                    style={
                        [
                            styles.messageTime,
                            item.type === 'user' ? styles.userTime : styles.botTime
                        ]}
                >
                    {item.time}
                </Text>
            </View>
        );
    };

    const renderTypingIndicator = () => (
        <View style={styles.messageWrapper}>
            <View style={[styles.messageBubble, styles.botBubble]}>
                <Text style={[styles.messageText, { fontStyle: 'italic', color: '#666' }]}>
                    MediBot is typing...
                </Text>
            </View>
        </View>
    );

    const openImagePicker = () => {
        Alert.alert(
            "Select Image",
            "Choose an option",
            [
                {
                    text: "Camera",
                    onPress: async () => {
                        const hasPermission = await requestCameraPermission();
                        if (!hasPermission) {
                            Alert.alert('Permission denied', 'Please enable camera permissions in settings.');
                            return;
                        }
                        ImagePicker.openCamera({
                            width: 300,
                            height: 400,
                            cropping: true,
                        }).then(image => {
                            handleImageSelected(image);
                        }).catch(err => {
                            console.log("Camera error or cancelled: ", err);
                        });
                    }
                },
                {
                    text: "Gallery",
                    onPress: () => {
                        ImagePicker.openPicker({
                            width: 300,
                            height: 400,
                            cropping: true,
                        }).then(image => {
                            handleImageSelected(image);
                        }).catch(err => {
                            console.log("Picker error or cancelled: ", err);
                        });
                    }
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ],
            { cancelable: true }
        );
    };

    const handleImageSelected = (image) => {
        setSelectedImage(image);
    };

    useEffect(() => {
        getAddresses();
    }, [selectedAddress]);

    const getAddresses = async () => {
        // const response = await axios.get('http://74.225.157.233:9000/api/v1/addresses/b03fa39f-e31d-4f50-b20c-e4c3adfe0a6a');
        const response = await axios.get('http://74.225.157.233:9000/api/v1/addresses/' + userId);
        setUserAddress(response?.data);
    };

    const handleAddressSelected = (address) => {
        setSelectedAddress(address);
        setIsModalVisible(false);
        const locationMsg = {
            id: Date.now().toString(),
            type: 'locationConfirm',
            text: `Confirm your location: ${address.formatted_address}`,
            time: getCurrentTime(),
            address: address,
        };

        setMessages(prevMessages => {
            const newMessages = [...prevMessages, locationMsg];
            setSessions(prevSessions =>
                prevSessions.map(session =>
                    session.id === activeSessionId
                        ? { ...session, messages: newMessages }
                        : session
                )
            );
            return newMessages;
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <SafeAreaView style={styles.container} >
                    <ChatHeader
                        onNewChat={resetChat}
                        onSessionChange={handleSessionChange}
                        sessions={sessions}
                        activeSessionId={activeSessionId}
                        setSessions={setSessions}
                        setSelectedModel={setSelectedModel}
                        selectedModel={selectedModel}
                    />

                    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
                        {!showQuickActions ? (
                            <FlatList
                                ref={flatListRef}
                                data={isTyping ? [...messages, { id: 'typing', type: 'typing' }] : messages}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) =>
                                    item.type === 'typing' ? renderTypingIndicator() : renderItem({ item })
                                }
                                contentContainerStyle={{
                                    padding: scale(10),
                                    paddingBottom: verticalScale(20),
                                }}
                                showsVerticalScrollIndicator={false}
                                onContentSizeChange={() =>
                                    flatListRef.current.scrollToEnd({ animated: true })
                                }
                            />
                        ) : (
                            <View style={styles.body} >
                                <Text style={{
                                    textAlign: 'center',
                                    padding: moderateScale(40),
                                    fontSize: scale(18),
                                    color: '#373743'
                                }}>
                                    Ask your first question or upload a prescription to get started
                                </Text>
                                <TouchableOpacity style={styles.button} onPress={openImagePicker}>
                                    <Icon name="upload" size={scale(16)} color="#000" />
                                    <Text style={styles.buttonText}> Upload prescription </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={() => handleActionPress('Search medicines')}>
                                    <Icon name="search" size={scale(16)} color="#000" />
                                    <Text style={styles.buttonText}> Search medicines </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={() => handleActionPress('Need help choosing?')}>
                                    <Icon name="help-circle" size={scale(16)} color="#000" />
                                    <Text style={styles.buttonText}> Need help choosing? </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {isModalVisible && (
                        <OfferModal
                            ref={modalizeRef}
                            offer={selectedOffer}
                            onConfirm={handleActionPress}
                            onClose={closeOfferModal}
                            navigation={navigation}
                            userAddress={userAddress}
                            onAddressSelected={handleAddressSelected}
                        />
                    )}

                    {!isModalVisible && (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
                            style={{ backgroundColor: '#F9FAFB' }}
                        >
                            {selectedImage && (
                                <View style={styles.quickActionsContainer}>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={quickActions}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.quickActionButton}
                                                onPress={() => handleDocPress(item)}
                                            >
                                                <Text style={styles.quickActionText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}

                            {selectedImage && (
                                <View style={styles.imagePreviewContainer}>
                                    <Text style={styles.imageName}>
                                        Img.png
                                    </Text>
                                </View>
                            )}
                            <View style={styles.inputContainer}>
                                <TouchableOpacity onPress={openImagePicker}>
                                    <Icon name="camera" size={scale(20)} color="#aaa" style={styles.cameraIcon} />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder="Write a message..."
                                    placeholderTextColor="#C5C6C7"
                                    style={styles.input}
                                    value={input}
                                    onChangeText={setInput}
                                    onSubmitEditing={() => handleActionPress(input)}
                                    returnKeyType="send"
                                />
                                <TouchableOpacity
                                    style={styles.sendButton}
                                    onPress={() => handleActionPress(input)}
                                >
                                    <Icon name="send" size={scale(20)} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                </SafeAreaView>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        fontFamily: 'UrbanistBlack',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: moderateScale(10),
        borderRadius: scale(12),
        marginBottom: verticalScale(6),
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#E6F9F1',
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    messageText: {
        fontSize: scale(14),
        color: '#333',
    },
    imageName: {
        fontSize: scale(14),
        color: '#333',
        paddingVertical: verticalScale(4),
    },
    messageWrapper: {
        marginBottom: verticalScale(8),
        paddingHorizontal: scale(5),
    },
    messageTime: {
        fontSize: scale(10),
        color: '#999',
    },
    userTime: {
        alignSelf: 'flex-end',
        marginRight: scale(10),
    },
    botTime: {
        alignSelf: 'flex-start',
        marginLeft: scale(10),
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: scale(20),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(20),
        marginVertical: verticalScale(5),
        borderWidth: 1,
        borderColor: '#E4E4E4'
    },
    buttonText: {
        marginLeft: scale(10),
        fontSize: scale(16),
        color: Colors.blackColor,
    },
    quickActionsContainer: {
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(10),
    },
    quickActionButton: {
        borderWidth: 1,
        borderColor: '#6B7280',
        borderRadius: scale(20),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        marginRight: scale(8),
    },
    quickActionText: {
        color: '#6B7280',
        fontSize: scale(14),
        fontWeight: '500',
    },
    imagePreviewContainer: {
        marginHorizontal: scale(15),
        marginVertical: verticalScale(6),
        position: 'relative',
    },
    imagePreview: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(10),
    },
    removeImageButton: {
        position: 'absolute',
        top: scale(4),
        right: scale(4),
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: scale(12),
        padding: scale(2),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: scale(25),
        paddingHorizontal: scale(12),
        marginHorizontal: scale(12),
        marginBottom: verticalScale(12),
        paddingVertical: verticalScale(4),
    },
    cameraIcon: {
        marginRight: scale(8),
    },
    input: {
        flex: 1,
        fontSize: scale(16),
        paddingVertical: verticalScale(10),
        color: 'black'
    },
    sendButton: {
        backgroundColor: '#31916E',
        borderRadius: scale(25),
        padding: scale(10),
    },
    offerCard: {
        backgroundColor: '#E6F9F1',
        borderRadius: scale(10),
        padding: scale(10),
        marginTop: verticalScale(10),
    },
    offerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    offerDiscount: {
        fontSize: scale(16),
        fontWeight: '500',
        color: '#31916E',
    },
    offerPrice: {
        fontSize: scale(16),
        fontWeight: '500',
        color: '#31916E',
    },
    offerDeliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(4),
    },
    offerDeliveryText: {
        fontSize: scale(13),
        fontWeight: '400',
        color: '#31916E',
        marginLeft: scale(4),
    },
    offerButton: {
        backgroundColor: '#31916E',
        borderRadius: scale(25),
        paddingVertical: verticalScale(10),
        marginTop: verticalScale(10),
        alignItems: 'center',
    },
    offerButtonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: scale(14),
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: verticalScale(10),
        gap: scale(8),
    },
    yesButton: {
        backgroundColor: '#31916E',
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(15),
        borderRadius: scale(50),
    },
    yesButtonText: {
        color: '#fff',
        fontSize: scale(14),
        fontWeight: '600',
    },
    noButton: {
        backgroundColor: '#E5E7EB',
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(15),
        borderRadius: scale(50),
    },
    noButtonText: {
        color: '#1F2937',
        fontSize: scale(14),
        fontWeight: '600',
    },
    imageContainer: {
        backgroundColor: '#2E7D32',
        borderRadius: 16,
        padding: 4,
        overflow: 'hidden',
    },
    chatImage: {
        width: scale(200),
        height: scale(150),
        borderRadius: 12,
        resizeMode: 'cover',
    },
});

export default ChatScreen;