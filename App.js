// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './src/screens/MainScreen'
import CountDownGameSetting from './src/screens/Countdown/CountDownGameSetting.jsx'
import CountDownGameSingle from './src/screens/Countdown/CountDownGameSingle.jsx'


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="CountDownGameSetting" component={CountDownGameSetting} />
        <Stack.Screen name="CountDownGameSingle" component={CountDownGameSingle} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;