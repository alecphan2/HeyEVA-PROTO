import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Pressable, Text, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export default function Index() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [ttsSound, setTtsSound] = useState(null);

  const deepgramApiKey = '840c51f9ad51bd729ed20c7c5989d615e1ae0e1c';

  const configureAudio = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  };

  const startRecording = async () => {
    await configureAudio();
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission Denied', 'Microphone access is required.');
      return;
    }
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    setRecording(null);
    setIsRecording(false);
    await transcribeRecording(uri);
  };

  const playRecording = async () => {
    if (!recordingUri) {
      Alert.alert('No Recording', 'Record some audio first.');
      return;
    }
    const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
    setSound(sound);
    await sound.playAsync();
  };

  const transcribeRecording = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const apiUrl = 'https://api.deepgram.com/v1/listen';
      const dgResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${deepgramApiKey}`,
          'Content-Type': 'audio/wav'
        },
        body: blob
      });
      if (!dgResponse.ok) {
        const errorText = await dgResponse.text();
        console.error('Transcription error:', errorText);
        Alert.alert('Transcription Error', errorText);
        return;
      }
      const result = await dgResponse.json();
      const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      setTranscription(transcript);
    } catch (error) {
      console.error('Error during transcription:', error);
      Alert.alert('Error', 'Failed to transcribe audio.');
    }
  };

  // Standard REST API call for Deepgram TTS
  const speakDeepgramTTS = async (text) => {
    try {
      const url = 'https://api.deepgram.com/v1/speak?bit_rate=192000&speak_sample_rate=1';
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Token ${deepgramApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('TTS error:', errorText);
        Alert.alert('TTS Error', errorText);
        return;
      }
      const data = await response.json();
      // Assuming the JSON response contains a property "audio" with base64-encoded MP3 data
      if (!data.audio) {
        Alert.alert("TTS Error", "No audio data received.");
        return;
      }
      let uri;
      if (Platform.OS === 'web') {
        // Use a data URI on web
        uri = `data:audio/mp3;base64,${data.audio}`;
      } else {
        // Write the file to cache on native platforms
        uri = FileSystem.cacheDirectory + 'deepgramTTS.mp3';
        await FileSystem.writeAsStringAsync(uri, data.audio, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
      const { sound } = await Audio.Sound.createAsync({ uri });
      setTtsSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error with TTS:', error);
      Alert.alert('TTS Error', 'Failed to generate or play TTS audio.');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={isRecording ? stopRecording : startRecording}>
        <Image
          source={{ uri: 'https://static.vecteezy.com/system/resources/previews/018/723/663/non_2x/microphone-button-icon-on-transparent-background-free-png.png' }}
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

      {transcription !== '' && (
        <>
          <Text style={styles.transcriptionText}>Transcription: {transcription}</Text>
          <Pressable style={styles.coolButton} onPress={() => speakDeepgramTTS(transcription)}>
            <Text style={styles.buttonText}>Play TTS (Deepgram)</Text>
          </Pressable>
        </>
      )}

      <TextInput style={styles.input} placeholder="Type something..." placeholderTextColor="#ccc" />
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
  transcriptionText: {
    color: '#fff',
    marginVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
