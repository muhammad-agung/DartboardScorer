import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function MainScreen({navigation}) {
  const handleGameModeSelection = (mode) => {
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
