import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Pressable, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function Index() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);

  const configureAudio = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  };

  const startRecording = async () => {
    await configureAudio();
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Denied', 'Microphone access is required to record audio.');
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const playRecording = async () => {
    if (!recordingUri) {
      Alert.alert('No Recording', 'Please record audio first.');
      return;
    }
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={isRecording ? stopRecording : startRecording}>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/018/723/663/non_2x/microphone-button-icon-on-transparent-background-free-png.png',
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>

      {isRecording && <Text style={styles.statusText}>Recording...</Text>}

      {!isRecording && recordingUri && (
        <Pressable style={styles.coolButton} onPress={playRecording}>
          <Text style={styles.buttonText}>▶ Play Recording</Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="Type something..."
        placeholderTextColor="#ccc"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#172957',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    marginVertical: 10,
  },
  input: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#2d3b6b',
    color: '#fff',
  },
  coolButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
