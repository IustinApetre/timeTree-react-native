import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../components/style'; // Import the Colors object
import { CredentialsContext } from '../components/CredentialsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for."
];

export const QuoteOfToday = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const today = new Date();
  const dayOfYear = today.getDay();
  const quoteIndex = dayOfYear % quotes.length;
  const quoteOfTheDay = quotes[quoteIndex];
  const handleLogoutPress = () => {
    // Implement logout functionality
    Alert.alert(
      "Delogare",
      "Ești sigur că vrei să te deloghezi?",
      [
        {
          text: "Nu",
          style: "cancel"
        },
        { text: "Da", onPress: () => clearLogin() }
      ]
    );
  };
  const clearLogin = () => {
    AsyncStorage.removeItem(`timeTreeCredentials`)
      .then(() => {
        setStoredCredentials(""); // Clear stored credentials
      })
      .catch(error => console.log(error))
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogoutPress} style={styles.logoutButton}>
        <Icon name="logout" size={30} color={Colors.black} />
      </TouchableOpacity>
      <ImageBackground source={require('../assets/img/logo.png')} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Animated.View style={{ ...styles.quoteContainer, opacity: fadeAnim }}>
            <Text style={styles.quoteText}>{quoteOfTheDay}</Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Adaugă această proprietate pentru a permite poziționarea absolută a butonului
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // or 'stretch'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)', // Adjust opacity as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1, // Asigură-te că butonul de logout este desenat deasupra imaginii de fundal
  },
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: 'black', // Use white text color
    textAlign: 'center',
    fontFamily: 'serif', // Use a specific font if necessary
  },
});

