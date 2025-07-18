import React, { useState, useRef, useEffect } from 'react';
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
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
    scale,
    verticalScale,
    moderateScale,
} from 'react-native-size-matters';
import ChatHeader from '../../components/ChatHeader';

const ChatScreen = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hi! I'm MediBot. Upload your prescription and I’ll help you find the best pharmacy deals.",
            type: 'bot',
        }
    ]);
    const flatListRef = useRef(null);
    const [showQuickActions, setShowQuickActions] = useState(true);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }, 100);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => { });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleActionPress = (text) => {
        if (!text.trim()) return;
        Keyboard.dismiss();
        setShowQuickActions(false);

        const userMsg = {
            id: Date.now().toString(),
            text,
            type: 'user',
        };

        const botReply = {
            id: (Date.now() + 1).toString(),
            text: `You selected: ${text}`,
            type: 'bot',
        };

        setMessages(prev => [...prev, userMsg, botReply]);
        setInput('');
    };

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.messageBubble,
                item.type === 'user' ? styles.userBubble : styles.botBubble
            ]}
        >
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ChatHeader />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexGrow}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={{ flex: 1 }}>
                    {!showQuickActions && (
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{
                                padding: scale(10),
                                paddingBottom: verticalScale(100),
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    {showQuickActions && (
                        <View style={styles.body}>
                            <TouchableOpacity style={styles.button} onPress={() => handleActionPress('Upload prescription')}>
                                <Icon name="upload" size={scale(16)} color="#000" />
                                <Text style={styles.buttonText}>Upload prescription</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={() => handleActionPress('Search medicines')}>
                                <Icon name="search" size={scale(16)} color="#000" />
                                <Text style={styles.buttonText}>Search medicines</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={() => handleActionPress('Need help choosing?')}>
                                <Icon name="help-circle" size={scale(16)} color="#000" />
                                <Text style={styles.buttonText}>Need help choosing ?</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Input Field */}
                <View style={styles.inputContainer}>
                    <Icon name="camera" size={scale(20)} color="#aaa" style={styles.cameraIcon} />
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flexGrow: {
        flex: 1,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: moderateScale(10),
        borderRadius: scale(12),
        marginBottom: verticalScale(10),
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#f1f1f1',
    },
    messageText: {
        fontSize: scale(14),
        color: '#333',
    },
    body: {
        alignItems: 'center',
        marginBottom: verticalScale(5),
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: scale(20),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(20),
        marginVertical: verticalScale(5),
    },
    buttonText: {
        marginLeft: scale(10),
        fontSize: scale(16),
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: scale(25),
        paddingHorizontal: scale(12),
        marginHorizontal: scale(10),
        marginBottom: verticalScale(10),
        paddingVertical: verticalScale(4),
    },
    cameraIcon: {
        marginRight: scale(8),
    },
    input: {
        flex: 1,
        fontSize: scale(16),
        paddingVertical: verticalScale(10),
    },
    sendButton: {
        backgroundColor: '#31916E',
        borderRadius: scale(25),
        padding: scale(10),
    },
});

export default ChatScreen;
