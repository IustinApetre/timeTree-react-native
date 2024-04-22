import React from 'react';
// Reacty navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//colors
import { Colors } from '../components/style';
// credetials context

import { CredentialsContext } from '../components/CredentialsContext';
const {primary} = Colors;

// screens

import Login from './../screens/Login'
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import { useAnimatedValue } from 'react-native';

const Stack = createNativeStackNavigator();

const RootStack = () => {
    return(
      <CredentialsContext.Consumer>
        { ({storedCredentials}) =>(

            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: 'transparent'
                },
                headerTintColor: primary.main,
                headerTransparent: true,
                headerTitle: '',
                headerLeftContainerStyle: {
                  paddingLeft: 20
                }
              }}
              initialRouteName="Login"
            >
              {storedCredentials ?
                <Stack.Screen options={{headerTintColor: primary.main}} name="Welcome" component={Welcome}/>
                : <>
                  <Stack.Screen name="Login" component={Login}/>
                  <Stack.Screen name="Signup" component={Signup}/>
                </>
              }


            </Stack.Navigator>

        )}
      </CredentialsContext.Consumer>
    );

}

export default RootStack;


