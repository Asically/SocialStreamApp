import { useState } from 'react';
import { View, TextInput, Button, Text, Picker } from 'react-native';
import axios from 'axios';

const LiveStream = () => {
    const [streamKey, setStreamKey] = useState('');
    const [platform, setPlatform] = useState('twitch');
    const [status, setStatus] = useState('');

    const startStream = async () => {
        try {
            const response = await axios.post('http://localhost:5000/start-stream', { streamKey, platform });
            setStatus(response.data.message);
        } catch (error) {
            setStatus('Failed to start stream');
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
                <Picker.Item label="Twitter (X)" value="twitter" />
                <Picker.Item label="Kick" value="kick" />
                <Picker.Item label="Rumble" value="rumble" />
            </Picker>
            <Button title="Start Stream" onPress={startStream} />
            <Text>{status}</Text>
        </View>
    );
};

export default LiveStream;
