import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../style';
import { CredentialsContext } from '../contexts/CredentialsContext';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';

const Stack = createNativeStackNavigator();
const { primary } = Colors;

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTintColor: primary.main,
            headerTransparent: true,
            headerTitle: '',
            headerLeftContainerStyle: {
              paddingLeft: 20,
            },
          }}
          initialRouteName='Login'
        >
          {storedCredentials ?
            <Stack.Screen options={{ headerTintColor: primary.main }} name='Welcome' component={Welcome} />
            : <>
              <Stack.Screen name='Login' component={Login} />
              <Stack.Screen name='Signup' component={Signup} />
            </>
          }
        </Stack.Navigator>
      )}
    </CredentialsContext.Consumer>
  );

};

export default RootStack;


