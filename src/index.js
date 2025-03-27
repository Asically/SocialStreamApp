// Import necessary modules
require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const { Server } = require('socket.io');
const http = require('http');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/socialstream', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to SocialStreamApp!');
});

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

// Referral and Social Sharing Logic
app.post('/referral', async (req, res) => {
  const { userId, referralCode } = req.body;
  const user = await User.findById(userId);
  
  if (user.referralCodes.includes(referralCode)) {
    return res.status(400).json({ message: 'Referral code already used' });
  }

  user.referrals += 1;
  if (user.referrals === 5) user.reward = 'Bronze Tier';
  if (user.referrals === 10) user.reward = 'Silver Tier';
  if (user.referrals === 20) user.reward = 'Gold Tier';
  if (user.referrals >= 50) user.reward = 'Platinum Tier';

  await user.save();
  res.status(200).json({ message: `Referral added. You have ${user.referrals} referrals.` });
});

app.post('/share', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);

  user.shares += 1;

  if (user.shares === 5) user.shareReward = 'Shared 5 times - Unlock Basic Prize';
  if (user.shares === 10) user.shareReward = 'Shared 10 times - VIP Access';
  if (user.shares === 20) user.shareReward = 'Shared 20 times - Exclusive Event Access';

  await user.save();
  res.status(200).json({ message: `Shared ${user.shares} times. Your reward: ${user.shareReward}` });
});

// Notifications (Mocked Logic)
app.post('/sendNotification', async (req, res) => {
  const { userId, type } = req.body;
  const user = await User.findById(userId);

  let message = '';

  switch (type) {
    case 'referral':
      message = `Congrats, ${user.username}! You've unlocked **${user.reward}** with ${user.referrals} referrals.`;
      break;
    case 'share':
      message = `Great job, ${user.username}! You've shared your referral link ${user.shares} times! Reward: ${user.shareReward}`;
      break;
    default:
      message = 'Invalid notification type';
  }

  console.log(`Notification sent to ${user.username}: ${message}`);
  res.status(200).json({ message: `Notification sent: ${message}` });
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

// Live Streaming Integration (Example for RTMP)
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
