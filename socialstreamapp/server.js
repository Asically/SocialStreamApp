// Removed shell script as it does not belong in a JavaScript file.

/* Initial Project Setup for Social Media Streaming App */

// Backend - server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/socialstream', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User Authentication Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('message', (data) => {
        io.emit('message', data);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Live Streaming Integration - RTMP Server Setup
const { exec } = require('child_process');
app.post('/start-stream', (req, res) => {
    const { streamKey, platform } = req.body;
    let streamUrl;
    
    switch (platform) {
        case 'twitch':
            streamUrl = `rtmp://live.twitch.tv/app/${streamKey}`;
            break;
        case 'youtube':
            streamUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
            break;
        case 'facebook':
            streamUrl = `rtmp://live-api-s.facebook.com:80/rtmp/${streamKey}`;
            break;
        case 'twitter':
            streamUrl = `rtmp://media.twitter.com/live/${streamKey}`;
            break;
        case 'kick':
            streamUrl = `rtmp://live.kick.com/app/${streamKey}`;
            break;
        case 'rumble':
            streamUrl = `rtmp://stream.rumble.com/live/${streamKey}`;
            break;
        default:
            return res.status(400).json({ message: 'Invalid platform' });
    }
    
    exec(`ffmpeg -re -i input.mp4 -c:v libx264 -preset fast -b:v 1500k -maxrate 1500k -bufsize 3000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 160k -ar 44100 -f flv ${streamUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ message: 'Streaming failed' });
        }
        console.log(`Streaming started: ${stdout}`);
        res.status(200).json({ message: 'Streaming started successfully' });
    });
});

// Frontend - Live Streaming Component
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

// DNS Setup script has been moved to a separate shell file: bind9-config/setup.sh
