// BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../style';
import Welcome from '../screens/Welcome';
import { Calendar } from '../screens/Calendar';
import { QuoteOfToday } from '../screens/QuoteOfToday';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex' }, // Stilul pentru bara de navigare
      tabBarActiveTintColor: Colors.primary.main, // Culoarea pentru butoanele active
      tabBarInactiveTintColor: 'gray', // Culoarea pentru butoanele inactive
      headerShown: false, // Ascunde antetul

      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Tasks') {
          iconName = focused ? 'checkmark-done-circle' : 'checkmark-done-circle-outline';
        } else if (route.name === 'Calendar') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'QuoteOfToday') {
          iconName = focused ? 'sparkles' : 'sparkles-outline';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Calendar" component={Calendar} />
    <Tab.Screen name="Tasks" component={Welcome} />
    <Tab.Screen name="QuoteOfToday" component={QuoteOfToday} />
  </Tab.Navigator>
);


export default BottomTabNavigator;
