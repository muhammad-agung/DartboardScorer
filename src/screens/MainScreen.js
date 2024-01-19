import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EnterOption from '../../assets/audio/enter.wav';

export default function MainScreen({ navigation }) {
  const [serverIP, setServerIP] = useState('');
  const [audioToPlay, setAudioToPlay] = useState(null);

  useEffect(() => {

    // Load the serverIP from AsyncStorage when the component mounts
    const loadServerIP = async () => {
      try {
        const savedServerIP = await AsyncStorage.getItem('serverIP');
        if (savedServerIP !== null) {
          setServerIP(savedServerIP);
        }
      } catch (error) {
        console.error('Error loading serverIP from AsyncStorage:', error);
      }
    };

    loadServerIP();


    return () => {
      if (audioToPlay) {
        audioToPlay.pause();
        setAudioToPlay(null);
      }
    };
  }, [audioToPlay]);

  const saveServerIPToStorage = async () => {
    try {
      await AsyncStorage.setItem('serverIP', serverIP);
    } catch (error) {
      console.error('Error saving serverIP to AsyncStorage:', error);
    }
  };


  const playAudio = () => {
    const audio = new Audio(EnterOption);
    audio.play();
    setAudioToPlay(audio);
  };

  const handleGameModeSelection = (mode) => {
    switch (mode) {
      case 'CountUp':
      case 'CountDownGameSetting':
        navigation.navigate(mode, { serverIP: serverIP });
      case 'Cricket':
        break;

      default:
        Alert.alert('Error');
    }
    playAudio();
  };

  const renderButton = (mode, label) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleGameModeSelection(mode)}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Game Mode</Text>
      {renderButton('CountDownGameSetting', 'Countdown')}
      {renderButton('CountUp', 'Countup')}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          Your Server IP Address (Default: http://localhost:3000 )
        </Text>
        <TextInput
          style={styles.input}
          value={serverIP}
          onChangeText={(text) => setServerIP(text)}
          onBlur={saveServerIPToStorage}
          placeholder={'Enter IP address'}
        />
      </View>
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
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: 'grey',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  inputTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

