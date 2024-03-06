import React, { useState, useEffect, useCallback } from 'react';


//React Navigation stack
import RootStack from './navigators/RootStack';

// appLoading
import * as SplashScreen from 'expo-splash-screen';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './components/CredentialsContext';
import { View } from 'react-native';


export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState('');

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
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        await checkLoginCredentials();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
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
        <RootStack />
      </CredentialsContext.Provider>);


}