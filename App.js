import React, { useState, useEffect } from 'react';
import RootStack from './src/navigators/RootStack';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './src/contexts/CredentialsContext';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/components/BottomTabNavigator';


export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const checkLoginCredentials = async () => {
    const result = await AsyncStorage
      .getItem(`timeTreeCredentials`);
    if (result !== null) {
      setStoredCredentials(JSON.parse(result));
    } else {
      setStoredCredentials(null);
    }
    return result;
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await checkLoginCredentials();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);


  if (!appReady) {
    return null;

  }
  return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <NavigationContainer>
        {storedCredentials ? <BottomTabNavigator /> : <RootStack />}
      </NavigationContainer>
    </CredentialsContext.Provider>
  );
}