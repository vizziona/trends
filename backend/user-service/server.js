const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongodb-0.mongodb,mongodb-1.mongodb,mongodb-2.mongodb:27017/users', { useNewUrlParser: true, useUnifiedTopology: true });

// Redis connection
const redisClient = redis.createClient({ host: 'redis-service' });
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// User model
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
});

// Register user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Get user profile
app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cachedUser = await getAsync(`user:${userId}`);
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await setAsync(`user:${userId}`, JSON.stringify(user), 'EX', 3600);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

const port = 3000;
app.listen(port, () => console.log(`User service listening on port ${port}`));
