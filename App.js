// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './src/screens/MainScreen'
import CountDown from './src/screens/Countdown/CountDown'
import Cricket from './src/screens/Cricket/Cricket'


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="CountDown" component={CountDown} />
        <Stack.Screen name="Cricket" component={Cricket} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;