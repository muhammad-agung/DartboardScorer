import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ImageBackground  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EnterOption from "../../assets/audio/enter.wav";

export default function MainScreen({navigation}) {
  let audioToPlay;
  const handleGameModeSelection = (mode) => {
    audioToPlay = new Audio(EnterOption);
    switch (mode) {
        case 'CountUp':
            navigation.navigate('CountUp')
        break;
        
        case 'CountDown':
            navigation.navigate('CountDown')
        break;
        
        case 'Cricket':
            navigation.navigate('Cricket')
        break;
        
        default:
        Alert("error")
        }
        audioToPlay.play();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Game Mode</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGameModeSelection('CountDown')}
      >
        <Text style={styles.buttonText}>Countdown</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGameModeSelection('Cricket')}
      >
        <Text style={styles.buttonText}>Cricket</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleGameModeSelection('CountUp')}
      >
        <Text style={styles.buttonText}>Countup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textTransform: "uppercase"
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "grey"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
