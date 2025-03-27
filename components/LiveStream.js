import React, { useState } from 'react';
import { View, TextInput, Button, Text, Picker } from 'react-native';
import axios from 'axios';

const LiveStream = () => {
  const [streamKey, setStreamKey] = useState('');
  const [platform, setPlatform] = useState('twitch');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState(''); // Assume this is retrieved after login
  const [shareCount, setShareCount] = useState(0);

  const startStream = async () => {
    try {
      const response = await axios.post('http://localhost:5000/start-stream', { streamKey, platform });
      setStatus(response.data.message);
    } catch (error) {
      setStatus('Failed to start stream');
    }
  };

  const handleReferral = async (referralCode) => {
    try {
      const response = await axios.post('http://localhost:5000/referral', { userId, referralCode });
      setStatus(response.data.message);
    } catch (error) {
      setStatus('Failed to add referral');
    }
  };

  const handleShare = async () => {
    try {
      const response = await axios.post('http://localhost:5000/share', { userId });
      setShareCount(prev => prev + 1);
      setStatus(response.data.message);
    } catch (error) {
      setStatus('Failed to share');
    }
  };

  const sendNotification = async () => {
    try {
      const response = await axios.post('http://localhost:5000/sendNotification', { userId, type: 'referral' });
      setStatus(response.data.message);
    } catch (error) {
      setStatus('Failed to send notification');
    }
  };

  return (
    <View>
      <Text>Enter Stream Key:</Text>
      <TextInput value={streamKey} onChangeText={setStreamKey} placeholder="Stream Key" />
      <Picker selectedValue={platform} onValueChange={(itemValue) => setPlatform(itemValue)}>
        <Picker.Item label="Twitch" value="twitch" />
        <Picker.Item label="YouTube" value="youtube" />
        <Picker.Item label="Facebook" value="facebook" />
      </Picker>
      <Button title="Start Stream" onPress={startStream} />

      <Text>Referral Code:</Text>
      <TextInput placeholder="Enter referral code" onSubmitEditing={(e) => handleReferral(e.nativeEvent.text)} />
      <Button title="Share Referral" onPress={handleShare} />

      <Text>{status}</Text>
      <Text>Shares: {shareCount}</Text>
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
};

export default LiveStream;
