import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context create karo
export const UserContext = createContext();

// Context Provider banaye
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initial state null

  // Load userId from AsyncStorage on mount
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error loading userId from AsyncStorage:', error);
      }
    };
    loadUserId();
  }, []);

  // Ye function user_id set karega
  const loginUser = async id => {
    try {
      setUserId(id);
      await AsyncStorage.setItem('userId', id);
    } catch (error) {
      console.error('Error saving userId to AsyncStorage:', error);
    }
  };

  // Ye function user_id clear karega (logout ke liye)
  const logoutUser = async () => {
    try {
      setUserId(null);
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      console.error('Error removing userId from AsyncStorage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userId, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
