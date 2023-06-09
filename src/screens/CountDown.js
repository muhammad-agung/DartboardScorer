import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CountDownGame from './CountDownGame.jsx'

const Stack = createNativeStackNavigator();

function GameSettingScreen({ navigation }) {
  const [maxStartingNumber, setMaxStartingNumber] = useState(301);
  const [activePlayerCount, setActivePlayerCount] = useState(0);

  const handleStartGame = () => {
    // Validate input and start the game
    if (activePlayerCount > 0) {
      console.log(`Starting Countdown game with ${activePlayerCount} players and max number ${maxStartingNumber}`);
      navigation.navigate('GameScreen', { totalPlayer: activePlayerCount, maxStartingNumber: maxStartingNumber});
      // Add your own logic to start the Countdown game
    } else {
      console.log('Please select the number of players.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Countdown Game</Text>
      <View style={styles.buttonContainer}>
        {/* Number of players buttons */}
        {[1, 2, 3].map((count) => (
          <TouchableOpacity
            key={count}
            style={activePlayerCount === count ? styles.selectedButton : styles.button}
            onPress={() => setActivePlayerCount(count)}
          >
            <Text style={styles.buttonText}>{count}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        {/* Max starting number buttons */}
        {[301, 501, 701].map((number) => (
          <TouchableOpacity
            key={number}
            style={maxStartingNumber === number ? styles.selectedButton : styles.button}
            onPress={() => setMaxStartingNumber(number)}
          >
            <Text style={styles.buttonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="GameSettingScreen"
          component={GameSettingScreen}
          options={{ title: 'Countdown Game' }}
        />
        <Stack.Screen
          name="GameScreen"
          component={CountDownGame}
          options={{ title: 'Countdown Game' }}
        />
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  playerScore: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  currentPlayerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentPlayerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nextPlayerButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 50,
  },
});